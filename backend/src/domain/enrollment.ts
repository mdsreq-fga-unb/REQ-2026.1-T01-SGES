import type { BaseDomain } from './base-domain'

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  EVADED = 'EVADED', // Desistiu / Evadiu por faltas
  COMPLETED = 'COMPLETED', // Concluiu o ciclo
}

export type Enrollment = BaseDomain & {
  studentId: string
  classId: string
  status: EnrollmentStatus
}
