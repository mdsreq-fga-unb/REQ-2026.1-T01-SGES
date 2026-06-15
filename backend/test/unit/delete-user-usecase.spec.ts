import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NotFoundError } from '@/application/infra/errors'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { UserRepository } from '@/application/services/user-repository'
import { DeleteUserUseCase } from '@/application/usecases/delete-user-usecase'
import { UserRole } from '@/domain'

const USER_ID = '11111111-1111-1111-1111-111111111111'

const makeStoredUser = () => ({
  id: USER_ID,
  registerCode: '123456',
  name: 'Test User',
  email: 'test@test.com',
  password: 'hashed',
  role: UserRole.TEACHER,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeValidator = (): Validator<DeleteUserUseCase.Input> => ({
  validate: vi.fn().mockImplementation(async (input) => input),
})

const makeUserRepository = (): UserRepository => ({
  findByEmail: vi.fn(),
  findById: vi.fn().mockResolvedValue(makeStoredUser()),
  findAll: vi.fn(),
  save: vi.fn(),
  updateResetCode: vi.fn(),
  updatePassword: vi.fn(),
  deleteById: vi.fn().mockResolvedValue(undefined),
})

describe('DeleteUserUseCase', () => {
  let userRepository: UserRepository
  let validator: Validator<DeleteUserUseCase.Input>
  let sut: DeleteUserUseCase

  beforeEach(() => {
    userRepository = makeUserRepository()
    validator = makeValidator()
    sut = new DeleteUserUseCase(userRepository, validator)
  })

  it('should delete user when id exists', async () => {
    await sut.execute({ id: USER_ID })

    expect(validator.validate).toHaveBeenCalledWith({ id: USER_ID })
    expect(userRepository.findById).toHaveBeenCalledWith(USER_ID)
    expect(userRepository.deleteById).toHaveBeenCalledWith(USER_ID)
  })

  it('should throw NotFoundError when id does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null)

    await expect(sut.execute({ id: USER_ID })).rejects.toBeInstanceOf(NotFoundError)
    expect(userRepository.deleteById).not.toHaveBeenCalled()
  })

  it('should propagate ValidationError from validator', async () => {
    const issues = [{ message: 'Invalid uuid', code: 'invalid_string', path: ['id'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(sut.execute({ id: 'not-a-uuid' })).rejects.toBeInstanceOf(ValidationError)
    expect(userRepository.findById).not.toHaveBeenCalled()
  })
})
