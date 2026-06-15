import type { BaseDomain } from './base-domain'

export type Student = BaseDomain & {
  codigoMatricula: string
  name: string
  email?: string | null
  profissao?: string | null
  fotoUrl?: string | null
}

export function generateStudentMatriculaCode(): string {
  // Gera um código de matrícula único amigável, ex: SEAS-2026-XXXXXX
  const year = new Date().getFullYear()
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  return `SEAS-${year}-${randomNum}`
}
