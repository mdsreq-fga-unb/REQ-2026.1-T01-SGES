import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UnauthorizedError } from '@/application/infra/errors'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { TokenService } from '@/application/services/token-service'
import type { UserRepository } from '@/application/services/user-repository'
import { AuthUseCase } from '@/application/usecases/auth-usecase'
import { UserRole } from '@/domain'

const makeUser = async (overrides = {}) => ({
  id: 'user-id',
  registerCode: '123456',
  name: 'Test User',
  email: 'test@test.com',
  password: await bcrypt.hash('secret01', 10),
  role: UserRole.TEACHER,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const makeValidator = (): Validator<AuthUseCase.Input> => ({
  validate: vi.fn().mockImplementation(async (input) => input),
})

const makeTokenService = (): TokenService => ({
  generate: vi.fn().mockReturnValue('jwt-token'),
  verify: vi.fn(),
})

const makeUserRepository = (): UserRepository => ({
  findByEmail: vi.fn(),
  save: vi.fn(),
})

describe('AuthUseCase', () => {
  let userRepository: UserRepository
  let tokenService: TokenService
  let validator: Validator<AuthUseCase.Input>
  let sut: AuthUseCase

  beforeEach(() => {
    userRepository = makeUserRepository()
    tokenService = makeTokenService()
    validator = makeValidator()
    sut = new AuthUseCase(userRepository, tokenService, validator)
  })

  it('should return a token for valid credentials', async () => {
    const user = await makeUser()
    vi.mocked(userRepository.findByEmail).mockResolvedValue(user)

    const output = await sut.execute({ email: user.email, password: 'secret01' })

    expect(output.token).toBe('jwt-token')
    expect(tokenService.generate).toHaveBeenCalledWith({
      email: user.email,
      role: user.role,
      name: user.name,
      registerCode: user.registerCode,
    })
  })

  it('should throw UnauthorizedError when user is not found', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

    await expect(
      sut.execute({ email: 'notfound@test.com', password: 'secret01' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when password does not match', async () => {
    const user = await makeUser()
    vi.mocked(userRepository.findByEmail).mockResolvedValue(user)

    await expect(
      sut.execute({ email: user.email, password: 'wrongpw' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should propagate ValidationError from validator', async () => {
    const issues = [{ message: 'Invalid email', code: 'invalid_string', path: ['email'] }] as any
    vi.mocked(validator.validate).mockRejectedValue(new ValidationError(issues))

    await expect(
      sut.execute({ email: 'not-email', password: 'secret01' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('should call validator with input before processing', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

    await expect(sut.execute({ email: 'x@x.com', password: 'pass' })).rejects.toThrow()

    expect(validator.validate).toHaveBeenCalledWith({ email: 'x@x.com', password: 'pass' })
  })
})
