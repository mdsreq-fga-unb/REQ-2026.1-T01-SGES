import type { AttendanceStatus } from '@/domain'
import { NotFoundError } from '@/application/infra/errors'
import type { ClassRepository } from '../services/class-repository'
import type { EnrollmentRepository } from '../services/enrollment-repository'
import type { StudentRepository } from '../services/student-repository'
import type { AttendanceRepository } from '../services/attendance-repository'

export type ListAttendanceByDateInput = {
  classId: string
  date: Date
}

export type AttendanceEntry = {
  studentId: string
  studentName: string
  status: AttendanceStatus | null
  observacao: string | null
  justificativaDetalhes: string | null
}

export class ListAttendanceByDateUseCase {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly attendanceRepository: AttendanceRepository
  ) {}

  async execute(input: ListAttendanceByDateInput): Promise<AttendanceEntry[]> {
    const classRoom = await this.classRepository.findById(input.classId)
    if (!classRoom) throw new NotFoundError('Class not found')

    const enrollments = await this.enrollmentRepository.findActiveByClass(input.classId)
    const attendances = await this.attendanceRepository.findByClassAndDate(input.classId, input.date)

    const attendanceByStudent = new Map(attendances.map((a) => [a.studentId, a]))

    const result: AttendanceEntry[] = []
    for (const enrollment of enrollments) {
      const student = await this.studentRepository.findById(enrollment.studentId)
      const attendance = attendanceByStudent.get(enrollment.studentId)
      result.push({
        studentId: enrollment.studentId,
        studentName: student?.name ?? 'Unknown',
        status: attendance?.status ?? null,
        observacao: attendance?.observacao ?? null,
        justificativaDetalhes: attendance?.justificativaDetalhes ?? null,
      })
    }

    return result
  }
}
