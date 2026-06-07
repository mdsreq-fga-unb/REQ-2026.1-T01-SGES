import { randomInt } from 'crypto'
import type { Validator } from '@/application/infra/services/shared/validator'
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
    await this.validator.validate(input)

    const user = await this.userRepository.findByEmail(input.email)
    if (!user) return

    const code = String(randomInt(100000, 999999))
    const expiresAt = new Date(Date.now() + ForgotPasswordUseCase.CODE_EXPIRY_MINUTES * 60 * 1000)

    await this.userRepository.updateResetCode(input.email, code, expiresAt)
    await this.queueProducer.add(QueueNames.SEND_RESET_CODE, { email: input.email, code })
  }
}

export namespace ForgotPasswordUseCase {
  export type Input = { email: string }
}
