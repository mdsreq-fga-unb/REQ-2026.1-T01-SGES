import type { BaseDomain } from './base-domain'
import type { User } from './user'

export type Class = BaseDomain & {
  nomeCurso: string
  livrosEstudados?: string | null
  horario: string
  diaSemana: string
  vagasLimite?: number | null
  instructors?: User[]
}
