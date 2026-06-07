import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { ResetPasswordUseCase } from '@/application/usecases/reset-password-usecase'

export class ResetPasswordUsecaseZodValidator implements Validator<ResetPasswordUseCase.Input> {
  private schema = z.object({
    email: z.email(),
    code: z.string().length(6),
    newPassword: z.string().min(4).max(8),
  })

  async validate(input: ResetPasswordUseCase.Input): Promise<ResetPasswordUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
