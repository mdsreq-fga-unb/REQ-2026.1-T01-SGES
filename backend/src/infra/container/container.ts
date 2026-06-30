import { DIContainer } from 'rsdi'
import { AuthUsecaseZodValidator } from '../../application/infra/services/shared/zod/auth-usecase-zod-validator'
import { CreateUserUsecaseZodValidator } from '../../application/infra/services/shared/zod/create-user-usecase-zod-validator'
import { DeleteUserUsecaseZodValidator } from '../../application/infra/services/shared/zod/delete-user-usecase-zod-validator'
import { ForgotPasswordUsecaseZodValidator } from '../../application/infra/services/shared/zod/forgot-password-usecase-zod-validator'
import { ListUsersUsecaseZodValidator } from '../../application/infra/services/shared/zod/list-users-usecase-zod-validator'
import { ResetPasswordUsecaseZodValidator } from '../../application/infra/services/shared/zod/reset-password-usecase-zod-validator'
import { EnrollStudentZodValidator } from '../../application/infra/services/shared/zod/enroll-student-zod-validator'
import { BulkEnrollStudentsZodValidator } from '../../application/infra/services/shared/zod/bulk-enroll-students-zod-validator'
import { RegisterAttendanceZodValidator } from '../../application/infra/services/shared/zod/register-attendance-zod-validator'
import { ListAttendanceByDateZodValidator } from '../../application/infra/services/shared/zod/list-attendance-by-date-zod-validator'
import { GetEnrollmentAbsencesZodValidator } from '../../application/infra/services/shared/zod/get-enrollment-absences-zod-validator'
import { AuthUseCase } from '../../application/usecases/auth-usecase'
import { CreateUserUseCase } from '../../application/usecases/create-user-usecase'
import { DeleteUserUseCase } from '../../application/usecases/delete-user-usecase'
import { UpdateUserUseCase } from '../../application/usecases/update-user-usecase'
import { UpdateUserUsecaseZodValidator } from '../../application/infra/services/shared/zod/update-user-usecase-zod-validator'
import { ForgotPasswordUseCase } from '../../application/usecases/forgot-password-usecase'
import { ListUsersUseCase } from '../../application/usecases/list-users-usecase'
import { ResetPasswordUseCase } from '../../application/usecases/reset-password-usecase'
import { EnrollStudentUseCase } from '../../application/usecases/enroll-student-usecase'
import { BulkEnrollStudentsUseCase } from '../../application/usecases/bulk-enroll-students-usecase'
import { TeacherRegisterPresenceUseCase } from '../../application/usecases/teacher-register-presence-usecase'
import { ListAttendanceByDateUseCase } from '../../application/usecases/list-attendance-by-date-usecase'
import { GetEnrollmentAbsencesUseCase } from '../../application/usecases/get-enrollment-absences-usecase'
import { UpdateAttendanceUseCase } from '../../application/usecases/update-attendance-usecase'
import { GetStudentHistoryUseCase } from '../../application/usecases/get-student-history-usecase'
import { GetFrequencyReportUseCase } from '../../application/usecases/get-frequency-report-usecase'
import { GetFunnelReportUseCase } from '../../application/usecases/get-funnel-report-usecase'
import { env } from '../../env'
import { UserTypeormRepository } from '../orm/repositories/user-repository'
import { StudentTypeormRepository } from '../orm/repositories/student-repository'
import { ClassTypeormRepository } from '../orm/repositories/class-repository'
import { EnrollmentTypeormRepository } from '../orm/repositories/enrollment-repository'
import { AttendanceTypeormRepository } from '../orm/repositories/attendance-repository'
import { NotificationTypeormRepository } from '../orm/repositories/notification-repository'
import { SecurityLogTypeormRepository } from '../orm/repositories/security-log-repository'
import { JwtTokenService } from '../services/token-service'
import { dataSource } from '../orm/datasource'
import { BullMQProducer } from '../queue/bullmq-producer'
import { NoopQueueProducer } from '../queue/noop-producer'
import { SyncQueueProducer } from '../queue/sync-producer'
import { NodemailerEmailService } from '../services/email/nodemailer-email-service'
import { NoopEmailService } from '../services/email/noop-email-service'
import logger from '../logger'

export type AppContainer = ReturnType<typeof buildContainer>

function buildQueueProducer() {
  if (env.NODE_ENV === 'test') return new NoopQueueProducer()

  if (env.REDIS_URL) return new BullMQProducer(env.REDIS_URL)

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return new SyncQueueProducer(
      new NodemailerEmailService({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
        from: env.SMTP_FROM ?? `SGES <${env.SMTP_USER}>`,
      }),
    )
  }

  logger.info('Nenhuma configuração de email encontrada — emails desabilitados (NoopQueueProducer)')
  return new NoopQueueProducer()
}

function buildEmailService() {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return new NodemailerEmailService({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      from: env.SMTP_FROM ?? `SGES <${env.SMTP_USER}>`,
    })
  }
  return new NoopEmailService()
}

export function buildContainer() {
  const queueProducer = buildQueueProducer()
  const emailService = buildEmailService()

  return new DIContainer()
    // Repositories
    .add('UserRepository', () => new UserTypeormRepository(dataSource))
    .add('StudentRepository', () => new StudentTypeormRepository(dataSource))
    .add('ClassRepository', () => new ClassTypeormRepository(dataSource))
    .add('EnrollmentRepository', () => new EnrollmentTypeormRepository(dataSource))
    .add('AttendanceRepository', () => new AttendanceTypeormRepository(dataSource))
    .add('NotificationRepository', () => new NotificationTypeormRepository(dataSource))
    .add('SecurityLogRepository', () => new SecurityLogTypeormRepository(dataSource))
    // Services
    .add('TokenService', () => new JwtTokenService(env.JWT_SECRET))
    // Auth use cases
    .add('AuthUsecase', ({ UserRepository, TokenService }) =>
      new AuthUseCase(UserRepository, TokenService, new AuthUsecaseZodValidator()),
    )
    .add('CreateUserUsecase', ({ UserRepository }) =>
      new CreateUserUseCase(UserRepository, new CreateUserUsecaseZodValidator(), queueProducer),
    )
    .add('DeleteUserUsecase', ({ UserRepository, SecurityLogRepository }) =>
      new DeleteUserUseCase(UserRepository, new DeleteUserUsecaseZodValidator(), SecurityLogRepository),
    )
    .add('UpdateUserUsecase', ({ UserRepository, SecurityLogRepository }) =>
      new UpdateUserUseCase(UserRepository, new UpdateUserUsecaseZodValidator(), SecurityLogRepository),
    )
    .add('ListUsersUsecase', ({ UserRepository }) =>
      new ListUsersUseCase(UserRepository, new ListUsersUsecaseZodValidator()),
    )
    .add('ForgotPasswordUsecase', ({ UserRepository }) =>
      new ForgotPasswordUseCase(
        UserRepository,
        new ForgotPasswordUsecaseZodValidator(),
        queueProducer,
      ),
    )
    .add('ResetPasswordUsecase', ({ UserRepository }) =>
      new ResetPasswordUseCase(UserRepository, new ResetPasswordUsecaseZodValidator()),
    )
    // Enrollment use cases
    .add('EnrollStudentUsecase', ({ StudentRepository, ClassRepository, EnrollmentRepository }) =>
      new EnrollStudentUseCase(StudentRepository, ClassRepository, EnrollmentRepository, new EnrollStudentZodValidator()),
    )
    .add('BulkEnrollStudentsUsecase', ({ StudentRepository, ClassRepository, EnrollmentRepository }) =>
      new BulkEnrollStudentsUseCase(StudentRepository, ClassRepository, EnrollmentRepository, new BulkEnrollStudentsZodValidator()),
    )
    .add('GetEnrollmentAbsencesUsecase', ({ EnrollmentRepository, AttendanceRepository }) =>
      new GetEnrollmentAbsencesUseCase(EnrollmentRepository, AttendanceRepository),
    )
    // Attendance use cases
    .add('TeacherRegisterPresenceUsecase', ({
      ClassRepository,
      StudentRepository,
      EnrollmentRepository,
      AttendanceRepository,
      UserRepository,
      NotificationRepository,
    }) =>
      new TeacherRegisterPresenceUseCase(
        ClassRepository,
        StudentRepository,
        EnrollmentRepository,
        AttendanceRepository,
        UserRepository,
        NotificationRepository,
        emailService,
        new RegisterAttendanceZodValidator(),
      ),
    )
    .add('ListAttendanceByDateUsecase', ({
      ClassRepository,
      EnrollmentRepository,
      StudentRepository,
      AttendanceRepository,
    }) =>
      new ListAttendanceByDateUseCase(ClassRepository, EnrollmentRepository, StudentRepository, AttendanceRepository),
    )
    .add('UpdateAttendanceUsecase', ({
      ClassRepository,
      StudentRepository,
      EnrollmentRepository,
      AttendanceRepository,
      SecurityLogRepository,
      UserRepository,
      NotificationRepository,
    }) =>
      new UpdateAttendanceUseCase(
        ClassRepository,
        StudentRepository,
        EnrollmentRepository,
        AttendanceRepository,
        SecurityLogRepository,
        UserRepository,
        NotificationRepository,
        emailService,
      ),
    )
    .add('GetStudentHistoryUsecase', ({
      StudentRepository,
      EnrollmentRepository,
      ClassRepository,
      AttendanceRepository,
    }) =>
      new GetStudentHistoryUseCase(
        StudentRepository,
        EnrollmentRepository,
        ClassRepository,
        AttendanceRepository,
      ),
    )
    .add('GetFrequencyReportUsecase', ({
      StudentRepository,
      EnrollmentRepository,
      ClassRepository,
      AttendanceRepository,
    }) =>
      new GetFrequencyReportUseCase(
        StudentRepository,
        EnrollmentRepository,
        ClassRepository,
        AttendanceRepository,
      ),
    )
    .add('GetFunnelReportUsecase', ({ EnrollmentRepository }) =>
      new GetFunnelReportUseCase(EnrollmentRepository),
    )
}

export const container = buildContainer()
