import type { BaseDomain, Enrollment, EnrollmentStatus } from '@/domain'

export interface EnrollmentRepository {
  findById(id: string): Promise<Enrollment | null>
  findByStudentAndClass(studentId: string, classId: string): Promise<Enrollment | null>
  findActiveByClass(classId: string): Promise<Enrollment[]>
  countActiveEnrollmentsByClass(classId: string): Promise<number>
  getFunnelData(classId?: string): Promise<{ entered: number; active: number; evaded: number; completed: number }>
  findAll(page: number, limit: number): Promise<{ enrollments: Enrollment[]; total: number }>
  save(data: Omit<Enrollment, keyof BaseDomain>): Promise<Enrollment>
  updateStatus(id: string, status: EnrollmentStatus): Promise<void>
  deleteById(id: string): Promise<void>
}
