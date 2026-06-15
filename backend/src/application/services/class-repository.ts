import type { BaseDomain, Class } from '@/domain'

export interface ClassRepository {
  findById(id: string): Promise<Class | null>
  findAll(page: number, limit: number): Promise<{ classes: Class[]; total: number }>
  save(data: Omit<Class, keyof BaseDomain>): Promise<Class>
  deleteById(id: string): Promise<void>
}
