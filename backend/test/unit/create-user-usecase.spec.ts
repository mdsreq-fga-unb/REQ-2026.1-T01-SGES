import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ConflictError } from '@/application/infra/errors'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { UserRepository } from '@/application/services/user-repository'
import type { IQueueProducer } from '@/application/services/queue-producer'
import { CreateUserUseCase } from '@/application/usecases/create-user-usecase'
import { UserRole } from '@/domain'

const makeInput = (overrides: Partial<CreateUserUseCase.Input> = {}): CreateUserUseCase.Input => ({
  name: 'Test User',
  email: 'test@test.com',
  password: 'secret01',
  registerCode: '202512345',
  role: UserRole.TEACHER,
  ...overrides,
})

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

const makeValidator = (): Validator<CreateUserUseCase.Input> => ({
  validate: vi.fn().mockImplementation(async (input) => input),
})

const makeUserRepository = (): UserRepository => ({
  findByEmail: vi.fn().mockResolvedValue(null),
  save: vi.fn().mockImplementation(async (data) => makeStoredUser({ ...data, id: 'new-id' })),
  updateResetCode: vi.fn().mockResolvedValue(undefined),
  updatePassword: vi.fn().mockResolvedValue(undefined),
})

const makeQueueProducer = (): IQueueProducer => ({
  add: vi.fn().mockResolvedValue(undefined),
})

describe('CreateUserUseCase', () => {
  let userRepository: UserRepository
  let validator: Validator<CreateUserUseCase.Input>
  let queueProducer: IQueueProducer
  let sut: CreateUserUseCase

  beforeEach(() => {
    userRepository = makeUserRepository()
    validator = makeValidator()
    queueProducer = makeQueueProducer()
    sut = new CreateUserUseCase(userRepository, validator, queueProducer)
  })

  it('should create a user and return output without password field', async () => {
    const input = makeInput()
    const output = await sut.execute(input)

    expect(output).toHaveProperty('id')
    expect(output).toHaveProperty('name', input.name)
    expect(output).toHaveProperty('email', input.email)
    expect(output).toHaveProperty('role', input.role)
    expect(output).toHaveProperty('registerCode', input.registerCode)
    expect(output).toHaveProperty('createdAt')
    expect(output).not.toHaveProperty('password')
  })

  it('should auto-generate a 6-digit registerCode when not provided', async () => {
    const input = makeInput({ registerCode: undefined })
    vi.mocked(userRepository.save).mockImplementation(async (data) =>
      makeStoredUser({ ...data, id: 'new-id' }),
    )

    const output = await sut.execute(input)

    const savedData = vi.mocked(userRepository.save).mock.calls[0][0]
    expect(savedData.registerCode).toMatch(/^\d{6}$/)
    expect(output.registerCode).toMatch(/^\d{6}$/)
  })

  it('should use provided registerCode when given', async () => {
    const input = makeInput({ registerCode: 'CUSTOM01' })
    await sut.execute(input)

    const savedData = vi.mocked(userRepository.save).mock.calls[0][0]
    expect(savedData.registerCode).toBe('CUSTOM01')
  })

  it('should throw ConflictError when email already exists', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(makeStoredUser())

    await expect(sut.execute(makeInput())).rejects.toBeInstanceOf(ConflictError)
  })

  it('should propagate ValidationError from validator', async () => {
    const issues = [{ message: 'Invalid email', code: 'invalid_string', path: ['email'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(sut.execute(makeInput())).rejects.toBeInstanceOf(ValidationError)
  })

  it('should hash the password before saving', async () => {
    const input = makeInput()
    await sut.execute(input)

    const savedData = vi.mocked(userRepository.save).mock.calls[0][0]
    expect(savedData.password).not.toBe(input.password)
    await expect(bcrypt.compare(input.password, savedData.password)).resolves.toBe(true)
  })

  it('should enqueue send-credentials job with plain password after saving', async () => {
    const input = makeInput()
    await sut.execute(input)

    expect(queueProducer.add).toHaveBeenCalledOnce()
    expect(queueProducer.add).toHaveBeenCalledWith('send-credentials', {
      name: input.name,
      email: input.email,
      password: input.password,
    })
  })

  it('should not enqueue if save throws', async () => {
    vi.mocked(userRepository.save).mockRejectedValue(new Error('DB error'))

    await expect(sut.execute(makeInput())).rejects.toThrow('DB error')
    expect(queueProducer.add).not.toHaveBeenCalled()
  })
})
