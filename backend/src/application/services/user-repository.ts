import type { BaseDomain, User } from '@/domain'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  save(data: Omit<User, keyof BaseDomain>): Promise<User>
  updateResetCode(email: string, code: string | null, expiresAt: Date | null): Promise<void>
  updatePassword(email: string, hashedPassword: string): Promise<void>
}
