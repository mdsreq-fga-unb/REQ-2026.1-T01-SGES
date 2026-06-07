import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { UnauthorizedError } from '@/application/infra/errors'
import type { UserRepository } from '../services/user-repository'

export class ResetPasswordUseCase {
  public static Name = 'ResetPasswordUseCase' as const

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator<ResetPasswordUseCase.Input>,
  ) {}

  async execute(input: ResetPasswordUseCase.Input): Promise<void> {
    await this.validator.validate(input)

    const user = await this.userRepository.findByEmail(input.email)

    if (!user?.resetCode || !user?.resetCodeExpiresAt) {
      throw new UnauthorizedError('Invalid or expired reset code')
    }

    if (user.resetCode !== input.code || new Date() > user.resetCodeExpiresAt) {
      throw new UnauthorizedError('Invalid or expired reset code')
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10)
    await this.userRepository.updatePassword(input.email, hashedPassword)
    await this.userRepository.updateResetCode(input.email, null, null)
  }
}

export namespace ResetPasswordUseCase {
  export type Input = {
    email: string
    code: string
    newPassword: string
  }
}
