import jwt from 'jsonwebtoken'
import type { TokenPayload, TokenService } from '@/application/services/token-service'

export class JwtTokenService implements TokenService {
  constructor(private readonly secret: string) {}

  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' })
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload
  }
}
