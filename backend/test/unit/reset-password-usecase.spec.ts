import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UnauthorizedError } from '@/application/infra/errors'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { UserRepository } from '@/application/services/user-repository'
import { ResetPasswordUseCase } from '@/application/usecases/reset-password-usecase'
import { UserRole } from '@/domain'

const VALID_CODE = '123456'
const FUTURE_EXPIRY = new Date(Date.now() + 30 * 60 * 1000)

const makeStoredUser = (overrides = {}) => ({
  id: 'user-id',
  registerCode: '202512345',
  name: 'Test User',
  email: 'test@test.com',
  password: 'hashed_password',
  role: UserRole.TEACHER,
  resetCode: VALID_CODE,
  resetCodeExpiresAt: FUTURE_EXPIRY,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const makeValidator = (): Validator<ResetPasswordUseCase.Input> => ({
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

describe('ResetPasswordUseCase', () => {
  let userRepository: UserRepository
  let validator: Validator<ResetPasswordUseCase.Input>
  let sut: ResetPasswordUseCase

  const validInput: ResetPasswordUseCase.Input = {
    email: 'test@test.com',
    code: VALID_CODE,
    newPassword: 'newPas1',
  }

  beforeEach(() => {
    userRepository = makeUserRepository()
    validator = makeValidator()
    sut = new ResetPasswordUseCase(userRepository, validator)
  })

  it('should update the password and clear the reset code on success', async () => {
    await sut.execute(validInput)

    expect(userRepository.updatePassword).toHaveBeenCalledOnce()
    const [email, hashed] = vi.mocked(userRepository.updatePassword).mock.calls[0]
    expect(email).toBe(validInput.email)
    await expect(bcrypt.compare(validInput.newPassword, hashed)).resolves.toBe(true)

    expect(userRepository.updateResetCode).toHaveBeenCalledWith(validInput.email, null, null)
  })

  it('should throw UnauthorizedError when user not found', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

    await expect(sut.execute(validInput)).rejects.toBeInstanceOf(UnauthorizedError)
    expect(userRepository.updatePassword).not.toHaveBeenCalled()
  })

  it('should throw UnauthorizedError when user has no reset code', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      makeStoredUser({ resetCode: null, resetCodeExpiresAt: null }),
    )

    await expect(sut.execute(validInput)).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when code does not match', async () => {
    await expect(
      sut.execute({ ...validInput, code: '000000' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
    expect(userRepository.updatePassword).not.toHaveBeenCalled()
  })

  it('should throw UnauthorizedError when code is expired', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      makeStoredUser({ resetCodeExpiresAt: new Date(Date.now() - 1000) }),
    )

    await expect(sut.execute(validInput)).rejects.toBeInstanceOf(UnauthorizedError)
    expect(userRepository.updatePassword).not.toHaveBeenCalled()
  })

  it('should throw ValidationError for invalid input', async () => {
    const issues = [{ message: 'Too short', code: 'too_small', path: ['newPassword'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(sut.execute(validInput)).rejects.toBeInstanceOf(ValidationError)
    expect(userRepository.findByEmail).not.toHaveBeenCalled()
  })
})
