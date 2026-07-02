import { AttendanceStatus, EnrollmentStatus } from '@/domain'
import type { Attendance } from '@/domain'
import { AppError, NotFoundError } from '@/application/infra/errors'
import type { AttendanceRepository } from '../services/attendance-repository'
import type { EnrollmentRepository } from '../services/enrollment-repository'
import type { ClassRepository } from '../services/class-repository'
import type { StudentRepository } from '../services/student-repository'
import type { SecurityLogRepository } from '../services/security-log-repository'
import type { UserRepository } from '../services/user-repository'
import type { NotificationRepository } from '../services/notification-repository'
import type { IEmailService } from '../services/email-service'

export type UpdateAttendanceInput = {
  classId: string
  date: Date
  justificativaDetalhes: string
  attendances: Array<{
    studentId: string
    status: AttendanceStatus
    observacao?: string
  }>
}

export class UpdateAttendanceUseCase {
  public static Name = 'UpdateAttendanceUseCase' as const

  constructor(
    private readonly classRepository: ClassRepository,
    private readonly studentRepository: StudentRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly securityLogRepository: SecurityLogRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: UpdateAttendanceInput): Promise<Attendance[]> {
    if (!input.classId) {
      throw new AppError(400, 'classId is required')
    }
    if (!input.date) {
      throw new AppError(400, 'date is required')
    }
    if (!input.justificativaDetalhes || input.justificativaDetalhes.trim() === '') {
      throw new AppError(422, 'Justificativa é obrigatória para alterações retroativas')
    }

    const classRoom = await this.classRepository.findById(input.classId)
    if (!classRoom) {
      throw new NotFoundError('Class not found')
    }

    // FE-5-B: Block future dates
    const classDate = new Date(input.date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (classDate > today) {
      throw new AppError(400, 'Não é possível registrar chamada para datas futuras.')
    }

    // 72 hours check
    const classTime = new Date(input.date).getTime()
    const nowTime = Date.now()
    const diffHours = (nowTime - classTime) / (1000 * 60 * 60)
    if (diffHours > 72) {
      throw new AppError(422, 'Prazo de 72 horas para alteração expirou')
    }

    const savedRecords: Attendance[] = []

    for (const record of input.attendances) {
      const student = await this.studentRepository.findById(record.studentId)
      if (!student) {
        throw new NotFoundError(`Student with ID ${record.studentId} not found`)
      }

      const studentEnrollment = await this.enrollmentRepository.findByStudentAndClass(record.studentId, input.classId, null)

      // Fetch old record
      const oldRecord = await this.attendanceRepository.findByStudentClassAndDate(record.studentId, input.classId, input.date)
      const oldStatus = oldRecord ? oldRecord.status : 'NONE'

      // Save new attendance
      const saved = await this.attendanceRepository.save({
        classId: input.classId,
        studentId: record.studentId,
        date: input.date,
        status: record.status,
        observacao: record.observacao || null,
        justificativaDetalhes: input.justificativaDetalhes,
      })
      savedRecords.push(saved)

      // Audit Log
      if (oldStatus !== record.status) {
        await this.securityLogRepository.save({
          userId: record.studentId,
          action: 'ALTER_ATTENDANCE',
          details: `Alteração de frequência na turma ${classRoom.nomeCurso} (${input.classId}) na data ${input.date.toISOString().split('T')[0]}: de ${oldStatus} para ${record.status}. Justificativa: ${input.justificativaDetalhes}`,
        })

        // Alert / Evasion Status Updates
        if (studentEnrollment) {
          const studentAttendances = await this.attendanceRepository.findStudentAttendances(record.studentId, input.classId)
          const absencesCount = studentAttendances.filter((a) => a.status === AttendanceStatus.ABSENT).length

          const admins = await this.userRepository.findAdmins()
          const instructors = classRoom.instructors || []

          if (absencesCount >= 3) {
            await this.enrollmentRepository.updateStatus(studentEnrollment.id, EnrollmentStatus.EVADED)

            if (student.email) {
              await this.emailService.sendAbsenceAlert(student.email, {
                studentName: student.name,
                courseName: classRoom.nomeCurso,
                absencesCount,
                limitReached: true,
              }).catch(() => {})
            }

            const title = 'Estudante Evadido por Faltas (Retroativo)'
            const message = `O estudante ${student.name} atingiu o limite de ${absencesCount} faltas no curso ${classRoom.nomeCurso} após correção de chamada retroativa.`

            for (const person of [...instructors, ...admins]) {
              await this.notificationRepository.save({
                userId: person.id,
                title,
                message,
                isRead: false,
              }).catch(() => {})

              if (person.email) {
                await this.emailService.sendAbsenceAlert(person.email, {
                  studentName: student.name,
                  courseName: classRoom.nomeCurso,
                  absencesCount,
                  limitReached: true,
                }).catch(() => {})
              }
            }
          } else if (studentEnrollment.status === EnrollmentStatus.EVADED && absencesCount < 3) {
            // Revert back to active if absences drop below 3
            await this.enrollmentRepository.updateStatus(studentEnrollment.id, EnrollmentStatus.ACTIVE)
          }
        }
      }
    }

    return savedRecords
  }
}
