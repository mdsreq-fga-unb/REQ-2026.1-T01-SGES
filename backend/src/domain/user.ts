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

export function generateDefaultPassord() {
  const specialChars = '@!#$%ˆ&*?';
  const lowerCase = `abcdefghijklmnopqrstuvwxyz`;
  const upperCase = lowerCase.toUpperCase();
  const numbers = `0123456789`;
  return `${Math.floor(Math.random() * specialChars.length)}${Math.floor(Math.random() * lowerCase.length)}${Math.floor(Math.random() * upperCase.length)}${Math.floor(Math.random() * numbers.length)}`;
}

export function generateRegisterCode() {
  return String(Date.now() % 1_000_000).padStart(6, '0');
}