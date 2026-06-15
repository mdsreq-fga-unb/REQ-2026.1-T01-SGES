import { randomInt } from 'crypto'
import type { Validator } from '@/application/infra/services/shared/validator'
import logger from '@/infra/logger'
import type { UserRepository } from '../services/user-repository'
import type { IQueueProducer } from '../services/queue-producer'
import { QueueNames } from '../services/queue-producer'

export class ForgotPasswordUseCase {
  public static Name = 'ForgotPasswordUseCase' as const

  private static CODE_EXPIRY_MINUTES = 30

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator<ForgotPasswordUseCase.Input>,
    private readonly queueProducer: IQueueProducer,
  ) {}

  async execute(input: ForgotPasswordUseCase.Input): Promise<void> {
    const validatedInput = await this.validator.validate(input)

    logger.debug({ email: validatedInput.email }, 'ForgotPassword: solicitação de recuperação iniciada')

    const user = await this.userRepository.findByEmail(validatedInput.email)
    if (!user) {
      logger.info({ email: validatedInput.email }, 'ForgotPassword: email não encontrado, retornando silenciosamente')
      return
    }

    const code = String(randomInt(100000, 999999))
    const expiresAt = new Date(Date.now() + ForgotPasswordUseCase.CODE_EXPIRY_MINUTES * 60 * 1000)

    await this.userRepository.updateResetCode(validatedInput.email, code, expiresAt)
    logger.debug({ email: validatedInput.email, expiresAt }, 'ForgotPassword: código gerado e salvo')

    await this.queueProducer.add(QueueNames.SEND_RESET_CODE, {
      email: validatedInput.email,
      code,
    })

    logger.info({ email: validatedInput.email, queue: QueueNames.SEND_RESET_CODE }, 'ForgotPassword: job de código enfileirado')
  }
}

export namespace ForgotPasswordUseCase {
  export type Input = { email: string }
}
