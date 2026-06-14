import type { BaseDomain } from './base-domain'

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  JUSTIFIED = 'JUSTIFIED',
  FT = 'FT', // Falta Trabalho (abono justificável por motivo de trabalho)
}

export type Attendance = BaseDomain & {
  classId: string
  studentId: string
  date: Date
  status: AttendanceStatus
  observacao?: string | null
  justificativaDetalhes?: string | null
}
