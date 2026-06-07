import { describe, expect, it } from 'vitest'
import { ValidationError } from '@/application/infra/services/shared/validation-error'
import { AuthUsecaseZodValidator } from '@/application/infra/services/shared/zod/auth-usecase-zod-validator'

describe('AuthUsecaseZodValidator', () => {
  const sut = new AuthUsecaseZodValidator()

  it('should return input when valid', async () => {
    const input = { email: 'user@email.com', password: 'secr01' }
    const result = await sut.validate(input)
    expect(result).toEqual(input)
  })

  it('should throw ValidationError for invalid email', async () => {
    await expect(
      sut.validate({ email: 'not-an-email', password: 'secr01' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('should throw ValidationError for empty password', async () => {
    await expect(
      sut.validate({ email: 'user@email.com', password: '' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('should throw ValidationError for password shorter than 4 characters', async () => {
    await expect(
      sut.validate({ email: 'user@email.com', password: 'abc' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('should throw ValidationError for password longer than 8 characters', async () => {
    await expect(
      sut.validate({ email: 'user@email.com', password: '123456789' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('should include zod issues in ValidationError', async () => {
    try {
      await sut.validate({ email: 'bad', password: '' })
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).issues.length).toBeGreaterThan(0)
    }
  })
})
