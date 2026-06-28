import { EnrollmentStatus } from '@/domain'
import type { Enrollment } from '@/domain'
import { AppError, ConflictError, NotFoundError } from '@/application/infra/errors'
import type { EnrollmentRepository } from '../services/enrollment-repository'
import type { ClassRepository } from '../services/class-repository'
import type { StudentRepository } from '../services/student-repository'

export type EnrollStudentInput = {
  studentId: string
  classId: string
}

export class EnrollStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly classRepository: ClassRepository,
    private readonly enrollmentRepository: EnrollmentRepository
  ) {}

  async execute(input: EnrollStudentInput): Promise<Enrollment> {
    const student = await this.studentRepository.findById(input.studentId)
    if (!student) throw new NotFoundError('Student not found')

    const classRoom = await this.classRepository.findById(input.classId)
    if (!classRoom) throw new NotFoundError('Class not found')

    const existing = await this.enrollmentRepository.findByStudentAndClass(input.studentId, input.classId)
    if (existing) throw new ConflictError('Student is already enrolled in this class')

    const activeCount = await this.enrollmentRepository.countActiveEnrollmentsByClass(input.classId)
    const limit = classRoom.vagasLimite ?? 50
    if (activeCount >= limit) {
      throw new AppError(422, `Class is full. Maximum limit of ${limit} vacancies reached.`)
    }

    return this.enrollmentRepository.save({
      studentId: input.studentId,
      classId: input.classId,
      status: EnrollmentStatus.ACTIVE,
    })
  }
}
