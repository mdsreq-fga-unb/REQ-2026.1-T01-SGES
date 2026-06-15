import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { UnauthorizedError } from '@/application/infra/errors'
import logger from '@/infra/logger'
import type { UserRepository } from '../services/user-repository'

export class ResetPasswordUseCase {
  public static Name = 'ResetPasswordUseCase' as const

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator<ResetPasswordUseCase.Input>,
  ) {}

  async execute(input: ResetPasswordUseCase.Input): Promise<void> {
    const validatedInput = await this.validator.validate(input)

    logger.debug({ email: validatedInput.email }, 'ResetPassword: tentativa de redefinição iniciada')

    const user = await this.userRepository.findByEmail(validatedInput.email)

    if (!user?.resetCode || !user?.resetCodeExpiresAt) {
      logger.info({ email: validatedInput.email }, 'ResetPassword: código de reset não encontrado')
      throw new UnauthorizedError('Invalid or expired reset code')
    }

    if (user.resetCode !== validatedInput.code || new Date() > user.resetCodeExpiresAt) {
      logger.info({ email: validatedInput.email }, 'ResetPassword: código inválido ou expirado')
      throw new UnauthorizedError('Invalid or expired reset code')
    }

    const hashedPassword = await bcrypt.hash(validatedInput.newPassword, 10)
    await this.userRepository.updatePassword(validatedInput.email, hashedPassword)
    await this.userRepository.updateResetCode(validatedInput.email, null, null)

    logger.info({ email: validatedInput.email }, 'ResetPassword: senha redefinida com sucesso')
  }
}

export namespace ResetPasswordUseCase {
  export type Input = {
    email: string
    code: string
    newPassword: string
  }
}
