import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { UserRepository } from '@/application/services/user-repository'
import type { IQueueProducer } from '@/application/services/queue-producer'
import { ForgotPasswordUseCase } from '@/application/usecases/forgot-password-usecase'
import { UserRole } from '@/domain'

const makeStoredUser = (overrides = {}) => ({
  id: 'user-id',
  registerCode: '202512345',
  name: 'Test User',
  email: 'test@test.com',
  password: 'hashed_password',
  role: UserRole.TEACHER,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const makeValidator = (): Validator<ForgotPasswordUseCase.Input> => ({
  validate: vi.fn().mockImplementation(async (input) => input),
})

const makeUserRepository = (): UserRepository => ({
  findByEmail: vi.fn().mockResolvedValue(makeStoredUser()),
  findById: vi.fn(),
  findAll: vi.fn(),
  save: vi.fn(),
  updateResetCode: vi.fn().mockResolvedValue(undefined),
  updatePassword: vi.fn().mockResolvedValue(undefined),
  deleteById: vi.fn(),
})

const makeQueueProducer = (): IQueueProducer => ({
  add: vi.fn().mockResolvedValue(undefined),
})

describe('ForgotPasswordUseCase', () => {
  let userRepository: UserRepository
  let validator: Validator<ForgotPasswordUseCase.Input>
  let queueProducer: IQueueProducer
  let sut: ForgotPasswordUseCase

  beforeEach(() => {
    userRepository = makeUserRepository()
    validator = makeValidator()
    queueProducer = makeQueueProducer()
    sut = new ForgotPasswordUseCase(userRepository, validator, queueProducer)
  })

  it('should store reset code and enqueue email when user exists', async () => {
    await sut.execute({ email: 'test@test.com' })

    expect(userRepository.updateResetCode).toHaveBeenCalledOnce()
    const [email, code, expiresAt] = vi.mocked(userRepository.updateResetCode).mock.calls[0]
    expect(email).toBe('test@test.com')
    expect(code).toMatch(/^\d{6}$/)
    expect(expiresAt).toBeInstanceOf(Date)
    expect(expiresAt!.getTime()).toBeGreaterThan(Date.now())

    expect(queueProducer.add).toHaveBeenCalledOnce()
    expect(queueProducer.add).toHaveBeenCalledWith('send-reset-code', {
      email: 'test@test.com',
      code,
    })
  })

  it('should silently return when user does not exist', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

    await expect(sut.execute({ email: 'ghost@test.com' })).resolves.toBeUndefined()
    expect(userRepository.updateResetCode).not.toHaveBeenCalled()
    expect(queueProducer.add).not.toHaveBeenCalled()
  })

  it('should throw ValidationError for invalid email', async () => {
    const issues = [{ message: 'Invalid email', code: 'invalid_string', path: ['email'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(sut.execute({ email: 'bad' })).rejects.toBeInstanceOf(ValidationError)
    expect(userRepository.findByEmail).not.toHaveBeenCalled()
  })

  it('generated code should be a 6-digit number string', async () => {
    await sut.execute({ email: 'test@test.com' })

    const [, code] = vi.mocked(userRepository.updateResetCode).mock.calls[0]
    expect(code).toMatch(/^\d{6}$/)
    expect(Number(code)).toBeGreaterThanOrEqual(100000)
    expect(Number(code)).toBeLessThanOrEqual(999999)
  })

  it('reset code should expire in ~30 minutes', async () => {
    const before = Date.now()
    await sut.execute({ email: 'test@test.com' })

    const [, , expiresAt] = vi.mocked(userRepository.updateResetCode).mock.calls[0]
    const diffMs = expiresAt!.getTime() - before
    expect(diffMs).toBeGreaterThanOrEqual(29 * 60 * 1000)
    expect(diffMs).toBeLessThanOrEqual(31 * 60 * 1000)
  })
})
