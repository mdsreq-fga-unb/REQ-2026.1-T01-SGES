import type { BaseDomain, Class } from '@/domain'

export interface ClassRepository {
  findById(id: string): Promise<Class | null>
  findAll(page: number, limit: number): Promise<{ classes: Class[]; total: number }>
  findByDetails(nomeCurso: string, diaSemana: string, horario: string, excludeId?: string): Promise<Class | null>
  findInstructorClasses(instructorId: string): Promise<Class[]>
  save(data: Omit<Class, keyof BaseDomain>): Promise<Class>
  deleteById(id: string): Promise<void>
}
