import { AttendanceStatus, EnrollmentStatus } from '@/domain'
import type { Attendance } from '@/domain'
import { AppError, NotFoundError } from '@/application/infra/errors'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { AttendanceRepository } from '../services/attendance-repository'
import type { EnrollmentRepository } from '../services/enrollment-repository'
import type { ClassRepository } from '../services/class-repository'
import type { StudentRepository } from '../services/student-repository'
import type { UserRepository } from '../services/user-repository'
import type { NotificationRepository } from '../services/notification-repository'
import type { IEmailService } from '../services/email-service'

export type RegisterPresenceInput = {
  classId: string
  date: Date
  alertThreshold?: number
  attendances: Array<{
    studentId: string
    status: AttendanceStatus
    observacao?: string
    justificativaDetalhes?: string
  }>
}

export class TeacherRegisterPresenceUseCase {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly studentRepository: StudentRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: IEmailService,
    private readonly validator: Validator<RegisterPresenceInput>
  ) {}

  async execute(input: RegisterPresenceInput): Promise<Attendance[]> {
    const validatedInput = await this.validator.validate(input)

    const classRoom = await this.classRepository.findById(validatedInput.classId)
    if (!classRoom) {
      throw new NotFoundError('Class not found')
    }

    // FE-5-B: Block future dates
    const classDate = new Date(validatedInput.date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (classDate > today) {
      throw new AppError(400, 'Não é possível registrar chamada para datas futuras.')
    }

    const savedRecords: Attendance[] = []
    const threshold = validatedInput.alertThreshold ?? 2

    for (const record of validatedInput.attendances) {
      const student = await this.studentRepository.findById(record.studentId)
      if (!student) {
        throw new NotFoundError(`Student with ID ${record.studentId} not found`)
      }

      const enrollment = await this.enrollmentRepository.findByStudentAndClass(record.studentId, validatedInput.classId)
      if (!enrollment) {
        throw new AppError(422, `Student ${student.name} is not enrolled in class ${classRoom.nomeCurso}`)
      }

      const saved = await this.attendanceRepository.save({
        classId: validatedInput.classId,
        studentId: record.studentId,
        date: validatedInput.date,
        status: record.status,
        observacao: record.observacao || null,
        justificativaDetalhes: record.justificativaDetalhes || null,
      })
      savedRecords.push(saved)

      if (record.status === AttendanceStatus.ABSENT) {
        const studentAttendances = await this.attendanceRepository.findStudentAttendances(record.studentId, validatedInput.classId)
        const absencesCount = studentAttendances.filter((a) => a.status === AttendanceStatus.ABSENT).length

        const admins = await this.userRepository.findAdmins()
        const instructors = classRoom.instructors || []

        if (absencesCount >= 3) {
          await this.enrollmentRepository.updateStatus(enrollment.id, EnrollmentStatus.EVADED)

          if (student.email) {
            await this.emailService.sendAbsenceAlert(student.email, {
              studentName: student.name,
              courseName: classRoom.nomeCurso,
              absencesCount,
              limitReached: true,
            }).catch(() => {})
          }

          const title = 'Estudante Evadido por Faltas'
          const message = `O estudante ${student.name} atingiu o limite de ${absencesCount} faltas no curso ${classRoom.nomeCurso} e foi marcado como evadido.`

          for (const instructor of instructors) {
            await this.notificationRepository.save({
              userId: instructor.id,
              title,
              message,
              isRead: false,
            }).catch(() => {})

            if (instructor.email) {
              await this.emailService.sendAbsenceAlert(instructor.email, {
                studentName: student.name,
                courseName: classRoom.nomeCurso,
                absencesCount,
                limitReached: true,
              }).catch(() => {})
            }
          }

          for (const admin of admins) {
            await this.notificationRepository.save({
              userId: admin.id,
              title,
              message,
              isRead: false,
            }).catch(() => {})

            if (admin.email) {
              await this.emailService.sendAbsenceAlert(admin.email, {
                studentName: student.name,
                courseName: classRoom.nomeCurso,
                absencesCount,
                limitReached: true,
              }).catch(() => {})
            }
          }
        } else if (absencesCount === threshold) {
          if (student.email) {
            await this.emailService.sendAbsenceAlert(student.email, {
              studentName: student.name,
              courseName: classRoom.nomeCurso,
              absencesCount,
              limitReached: false,
            }).catch(() => {})
          }

          const title = 'Alerta de Limite de Faltas Próximo'
          const message = `O estudante ${student.name} atingiu ${absencesCount} faltas no curso ${classRoom.nomeCurso}. O limite máximo é de 3 faltas.`

          for (const instructor of instructors) {
            await this.notificationRepository.save({
              userId: instructor.id,
              title,
              message,
              isRead: false,
            }).catch(() => {})

            if (instructor.email) {
              await this.emailService.sendAbsenceAlert(instructor.email, {
                studentName: student.name,
                courseName: classRoom.nomeCurso,
                absencesCount,
                limitReached: false,
              }).catch(() => {})
            }
          }

          for (const admin of admins) {
            await this.notificationRepository.save({
              userId: admin.id,
              title,
              message,
              isRead: false,
            }).catch(() => {})

            if (admin.email) {
              await this.emailService.sendAbsenceAlert(admin.email, {
                studentName: student.name,
                courseName: classRoom.nomeCurso,
                absencesCount,
                limitReached: false,
              }).catch(() => {})
            }
          }
        }
      }
    }

    return savedRecords
  }
}
