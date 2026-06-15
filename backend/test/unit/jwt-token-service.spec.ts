import { describe, expect, it } from 'vitest'
import type { TokenPayload } from '@/application/services/token-service'
import { UserRole } from '@/domain'
import { JwtTokenService } from '@/infra/services/token-service'

const SECRET = 'test-secret-key'

const payload: TokenPayload = {
  email: 'user@test.com',
  role: UserRole.TEACHER,
  name: 'Test User',
  registerCode: '123456',
}

describe('JwtTokenService', () => {
  const sut = new JwtTokenService(SECRET)

  it('should generate a non-empty JWT string', () => {
    const token = sut.generate(payload)
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('should verify and return the original payload', () => {
    const token = sut.generate(payload)
    const decoded = sut.verify(token)

    expect(decoded.email).toBe(payload.email)
    expect(decoded.role).toBe(payload.role)
    expect(decoded.name).toBe(payload.name)
    expect(decoded.registerCode).toBe(payload.registerCode)
  })

  it('should throw when verifying a token signed with a different secret', () => {
    const otherService = new JwtTokenService('other-secret')
    const token = otherService.generate(payload)

    expect(() => sut.verify(token)).toThrow()
  })

  it('should throw when verifying a malformed token', () => {
    expect(() => sut.verify('not.a.valid.jwt')).toThrow()
  })
})
