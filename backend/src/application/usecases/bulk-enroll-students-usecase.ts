import { EnrollmentStatus } from '@/domain'
import type { Enrollment } from '@/domain'
import type { EnrollmentRepository } from '../services/enrollment-repository'
import type { ClassRepository } from '../services/class-repository'
import type { StudentRepository } from '../services/student-repository'

export type BulkEnrollStudentsInput = {
  classId: string
  studentIds: string[]
}

export type BulkEnrollStudentsOutput = {
  enrolled: Enrollment[]
  failed: { studentId: string; reason: string }[]
}

export class BulkEnrollStudentsUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly classRepository: ClassRepository,
    private readonly enrollmentRepository: EnrollmentRepository
  ) {}

  async execute(input: BulkEnrollStudentsInput): Promise<BulkEnrollStudentsOutput> {
    const enrolled: Enrollment[] = []
    const failed: { studentId: string; reason: string }[] = []

    const classRoom = await this.classRepository.findById(input.classId)
    if (!classRoom) {
      return {
        enrolled: [],
        failed: input.studentIds.map((studentId) => ({ studentId, reason: 'Class not found' })),
      }
    }

    for (const studentId of input.studentIds) {
      try {
        const student = await this.studentRepository.findById(studentId)
        if (!student) {
          failed.push({ studentId, reason: 'Student not found' })
          continue
        }

        const existing = await this.enrollmentRepository.findByStudentAndClass(studentId, input.classId)
        if (existing) {
          failed.push({ studentId, reason: 'Student is already enrolled in this class' })
          continue
        }

        const activeCount = await this.enrollmentRepository.countActiveEnrollmentsByClass(input.classId)
        const limit = classRoom.vagasLimite ?? 50
        if (activeCount >= limit) {
          failed.push({ studentId, reason: `Class is full. Maximum limit of ${limit} vacancies reached.` })
          continue
        }

        const enrollment = await this.enrollmentRepository.save({
          studentId,
          classId: input.classId,
          status: EnrollmentStatus.ACTIVE,
        })
        enrolled.push(enrollment)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        failed.push({ studentId, reason: message })
      }
    }

    return { enrolled, failed }
  }
}
