import type { BaseDomain } from './base-domain'

export type InstructorHistory = BaseDomain & {
  instructorId: string
  classId: string
  semestre: string
  ano: number
}
