import type { UserRole } from '@/domain'

export type TokenPayload = {
  email: string
  role: UserRole
  name: string
  registerCode: string
}

export interface TokenService {
  generate(payload: TokenPayload): string
  verify(token: string): TokenPayload
}
