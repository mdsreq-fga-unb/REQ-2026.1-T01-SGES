import type { BaseDomain, InstructorHistory } from '@/domain'

export interface InstructorHistoryRepository {
  findById(id: string): Promise<InstructorHistory | null>
  findBySemesterOrYear(semester?: string, year?: number): Promise<InstructorHistory[]>
  save(data: Omit<InstructorHistory, keyof BaseDomain>): Promise<InstructorHistory>
  deleteById(id: string): Promise<void>
}
