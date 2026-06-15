import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { UserRepository } from '@/application/services/user-repository'
import { ListUsersUseCase } from '@/application/usecases/list-users-usecase'
import { UserRole } from '@/domain'

const makeUser = (overrides = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  registerCode: '123456',
  name: 'Test User',
  email: 'test@test.com',
  password: 'hashed',
  role: UserRole.TEACHER,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const makeValidator = (): Validator<ListUsersUseCase.Input> => ({
  validate: vi.fn().mockImplementation(async (input) => ({ page: input.page ?? 1 })),
})

const makeUserRepository = (): UserRepository => ({
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn().mockResolvedValue({ users: [makeUser()], total: 1 }),
  save: vi.fn(),
  updateResetCode: vi.fn(),
  updatePassword: vi.fn(),
  deleteById: vi.fn(),
})

describe('ListUsersUseCase', () => {
  let userRepository: UserRepository
  let validator: Validator<ListUsersUseCase.Input>
  let sut: ListUsersUseCase

  beforeEach(() => {
    userRepository = makeUserRepository()
    validator = makeValidator()
    sut = new ListUsersUseCase(userRepository, validator)
  })

  it('should return paginated list with metadata', async () => {
    const output = await sut.execute({ page: 1 })

    expect(output.data).toHaveLength(1)
    expect(output.page).toBe(1)
    expect(output.limit).toBe(10)
    expect(output.total).toBe(1)
    expect(output.totalPages).toBe(1)
    expect(output.data[0]).not.toHaveProperty('password')
  })

  it('should default to page 1 when not provided', async () => {
    await sut.execute({})

    expect(userRepository.findAll).toHaveBeenCalledWith(1, 10)
  })

  it('should call findAll with correct skip for page 2', async () => {
    vi.mocked(validator.validate).mockResolvedValue({ page: 2 })

    await sut.execute({ page: 2 })

    expect(userRepository.findAll).toHaveBeenCalledWith(2, 10)
  })

  it('should calculate totalPages correctly', async () => {
    vi.mocked(userRepository.findAll).mockResolvedValue({
      users: Array(10).fill(makeUser()),
      total: 25,
    })

    const output = await sut.execute({ page: 1 })

    expect(output.totalPages).toBe(3)
  })

  it('should propagate ValidationError from validator', async () => {
    const issues = [{ message: 'Too small', code: 'too_small', path: ['page'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(sut.execute({ page: 0 })).rejects.toBeInstanceOf(ValidationError)
    expect(userRepository.findAll).not.toHaveBeenCalled()
  })
})
