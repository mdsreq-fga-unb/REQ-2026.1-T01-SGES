import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NotFoundError, ConflictError } from '@/application/infra/errors'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { UserRepository } from '@/application/services/user-repository'
import { UpdateUserUseCase } from '@/application/usecases/update-user-usecase'
import { UserRole } from '@/domain'

const USER_ID = '11111111-1111-1111-1111-111111111111'

const makeStoredUser = () => ({
  id: USER_ID,
  registerCode: '123456',
  name: 'Old Name',
  email: 'old@test.com',
  password: 'hashed',
  role: UserRole.TEACHER,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeValidator = (): Validator<UpdateUserUseCase.Input> => ({
  validate: vi.fn().mockImplementation(async (input) => input),
})

const makeUserRepository = (): UserRepository => ({
  findByEmail: vi.fn().mockResolvedValue(null),
  findById: vi.fn().mockResolvedValue(makeStoredUser()),
  findAll: vi.fn(),
  save: vi.fn().mockImplementation(async (user) => user),
  updateResetCode: vi.fn(),
  updatePassword: vi.fn(),
  deleteById: vi.fn(),
})

describe('UpdateUserUseCase', () => {
  let userRepository: UserRepository
  let securityLogRepository: any
  let validator: Validator<UpdateUserUseCase.Input>
  let sut: UpdateUserUseCase

  beforeEach(() => {
    userRepository = makeUserRepository()
    securityLogRepository = {
      save: vi.fn().mockResolvedValue({ id: 'log-id' }),
    }
    validator = makeValidator()
    sut = new UpdateUserUseCase(userRepository, validator, securityLogRepository)
  })

  it('should update user successfully when input is valid', async () => {
    const input = {
      id: USER_ID,
      name: 'New Name',
      email: 'new@test.com',
      role: UserRole.ADMIN,
    }

    const result = await sut.execute(input)

    expect(validator.validate).toHaveBeenCalledWith(input)
    expect(userRepository.findById).toHaveBeenCalledWith(USER_ID)
    expect(userRepository.findByEmail).toHaveBeenCalledWith('new@test.com')
    expect(userRepository.save).toHaveBeenCalled()
    expect(securityLogRepository.save).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'UPDATE_USER',
      details: expect.stringContaining('Updated user profile'),
    })
    expect(result.name).toBe('New Name')
    expect(result.email).toBe('new@test.com')
    expect(result.role).toBe(UserRole.ADMIN)
  })

  it('should throw NotFoundError when user does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null)

    await expect(
      sut.execute({
        id: USER_ID,
        name: 'New Name',
        email: 'new@test.com',
        role: UserRole.ADMIN,
      })
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw ConflictError when email is already in use by another user', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'another-user-id',
      registerCode: '654321',
      name: 'Another User',
      email: 'new@test.com',
      password: 'hashed',
      role: UserRole.TEACHER,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(
      sut.execute({
        id: USER_ID,
        name: 'New Name',
        email: 'new@test.com',
        role: UserRole.ADMIN,
      })
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('should not check email uniqueness if email remains the same', async () => {
    const input = {
      id: USER_ID,
      name: 'New Name',
      email: 'old@test.com',
      role: UserRole.TEACHER,
    }

    await sut.execute(input)

    expect(userRepository.findByEmail).not.toHaveBeenCalled()
    expect(userRepository.save).toHaveBeenCalled()
  })

  it('should propagate ValidationError from validator', async () => {
    const issues = [{ message: 'Required', code: 'invalid_type', path: ['name'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(
      sut.execute({
        id: USER_ID,
        name: '',
        email: 'invalid-email',
        role: UserRole.ADMIN,
      })
    ).rejects.toBeInstanceOf(ValidationError)
  })
})
