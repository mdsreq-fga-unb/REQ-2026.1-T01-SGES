import { DIContainer } from 'rsdi'
import { AuthUsecaseZodValidator } from '../../application/infra/services/shared/zod/auth-usecase-zod-validator'
import { CreateUserUsecaseZodValidator } from '../../application/infra/services/shared/zod/create-user-usecase-zod-validator'
import { DeleteUserUsecaseZodValidator } from '../../application/infra/services/shared/zod/delete-user-usecase-zod-validator'
import { ForgotPasswordUsecaseZodValidator } from '../../application/infra/services/shared/zod/forgot-password-usecase-zod-validator'
import { ListUsersUsecaseZodValidator } from '../../application/infra/services/shared/zod/list-users-usecase-zod-validator'
import { ResetPasswordUsecaseZodValidator } from '../../application/infra/services/shared/zod/reset-password-usecase-zod-validator'
import { AuthUseCase } from '../../application/usecases/auth-usecase'
import { CreateUserUseCase } from '../../application/usecases/create-user-usecase'
import { DeleteUserUseCase } from '../../application/usecases/delete-user-usecase'
import { ForgotPasswordUseCase } from '../../application/usecases/forgot-password-usecase'
import { ListUsersUseCase } from '../../application/usecases/list-users-usecase'
import { ResetPasswordUseCase } from '../../application/usecases/reset-password-usecase'
import { env } from '../../env'
import { UserTypeormRepository } from '../orm/repositories/user-repository'
import { JwtTokenService } from '../services/token-service'
import { dataSource } from '../orm/datasource'
import { BullMQProducer } from '../queue/bullmq-producer'
import { NoopQueueProducer } from '../queue/noop-producer'
import { SyncQueueProducer } from '../queue/sync-producer'
import { NodemailerEmailService } from '../services/email/nodemailer-email-service'
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

export function buildContainer() {
  const queueProducer = buildQueueProducer()

  return new DIContainer()
    .add('UserRepository', () => new UserTypeormRepository(dataSource))
    .add('TokenService', () => new JwtTokenService(env.JWT_SECRET))
    .add('AuthUsecase', ({ UserRepository, TokenService }) =>
      new AuthUseCase(UserRepository, TokenService, new AuthUsecaseZodValidator()),
    )
    .add('CreateUserUsecase', ({ UserRepository }) =>
      new CreateUserUseCase(UserRepository, new CreateUserUsecaseZodValidator(), queueProducer),
    )
    .add('DeleteUserUsecase', ({ UserRepository }) =>
      new DeleteUserUseCase(UserRepository, new DeleteUserUsecaseZodValidator()),
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
}

export const container = buildContainer()
