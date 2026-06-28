import type { BaseDomain, Attendance } from '@/domain'

export interface AttendanceRepository {
  findById(id: string): Promise<Attendance | null>
  findByStudentClassAndDate(studentId: string, classId: string, date: Date): Promise<Attendance | null>
  findByClassAndDate(classId: string, date: Date): Promise<Attendance[]>
  findStudentAttendances(studentId: string, classId: string): Promise<Attendance[]>
  save(data: Omit<Attendance, keyof BaseDomain>): Promise<Attendance>
  deleteById(id: string): Promise<void>
}
