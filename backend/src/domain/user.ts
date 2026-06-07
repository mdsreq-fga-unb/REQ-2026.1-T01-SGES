import type { BaseDomain } from './base-domain'

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export type User = BaseDomain & {
  registerCode: string
  name: string
  email: string
  password: string
  role: UserRole
  resetCode?: string | null
  resetCodeExpiresAt?: Date | null
}
