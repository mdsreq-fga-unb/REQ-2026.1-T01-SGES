import type { BaseDomain, Student } from '@/domain'

export interface StudentRepository {
  findById(id: string): Promise<Student | null>
  findByCodigoMatricula(codigoMatricula: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  findAll(page: number, limit: number): Promise<{ students: Student[]; total: number }>
  save(data: Omit<Student, keyof BaseDomain>): Promise<Student>
  deleteById(id: string): Promise<void>
}
