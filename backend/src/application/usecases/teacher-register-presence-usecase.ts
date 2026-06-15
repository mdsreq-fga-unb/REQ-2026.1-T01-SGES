import { AttendanceStatus, EnrollmentStatus } from '@/domain'
import type { Attendance } from '@/domain'
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
  alertThreshold?: number // limite configurável (padrão 2, mas pode ser 1)
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
    private readonly emailService: IEmailService
  ) {}

  async execute(input: RegisterPresenceInput): Promise<Attendance[]> {
    const classRoom = await this.classRepository.findById(input.classId)
    if (!classRoom) {
      throw new Error('Class not found')
    }

    const savedRecords: Attendance[] = []
    const threshold = input.alertThreshold ?? 2

    for (const record of input.attendances) {
      const student = await this.studentRepository.findById(record.studentId)
      if (!student) {
        throw new Error(`Student with ID ${record.studentId} not found`)
      }

      // Validar se o estudante está matriculado na turma
      const enrollment = await this.enrollmentRepository.findByStudentAndClass(record.studentId, input.classId)
      if (!enrollment) {
        throw new Error(`Student ${student.name} is not enrolled in class ${classRoom.nomeCurso}`)
      }

      // Salvar ou atualizar o registro de presença no banco
      const saved = await this.attendanceRepository.save({
        classId: input.classId,
        studentId: record.studentId,
        date: input.date,
        status: record.status,
        observacao: record.observacao || null,
        justificativaDetalhes: record.justificativaDetalhes || null,
      })
      savedRecords.push(saved)

      // O status de Falta Trabalho (FT) e Justificada não contam como falta não justificada (ABSENT)
      if (record.status === AttendanceStatus.ABSENT) {
        const studentAttendances = await this.attendanceRepository.findStudentAttendances(record.studentId, input.classId)
        const absencesCount = studentAttendances.filter((a) => a.status === AttendanceStatus.ABSENT).length

        const admins = await this.userRepository.findAdmins()
        const instructors = classRoom.instructors || []

        if (absencesCount >= 3) {
          // Desistência automática por excesso de faltas
          await this.enrollmentRepository.updateStatus(enrollment.id, EnrollmentStatus.EVADED)

          // Email automático para o aluno
          if (student.email) {
            await this.emailService.sendAbsenceAlert(student.email, {
              studentName: student.name,
              courseName: classRoom.nomeCurso,
              absencesCount,
              limitReached: true,
            }).catch(() => {})
          }

          // Criar Alertas no Sistema e Emails para Instrutores e Gestores
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
          // Email automático de aviso para o aluno
          if (student.email) {
            await this.emailService.sendAbsenceAlert(student.email, {
              studentName: student.name,
              courseName: classRoom.nomeCurso,
              absencesCount,
              limitReached: false,
            }).catch(() => {})
          }

          // Criar Alertas no Sistema e Emails para Instrutores e Gestores
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
