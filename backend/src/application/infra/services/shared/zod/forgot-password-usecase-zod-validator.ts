import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { ForgotPasswordUseCase } from '@/application/usecases/forgot-password-usecase'

export class ForgotPasswordUsecaseZodValidator implements Validator<ForgotPasswordUseCase.Input> {
  private schema = z.object({
    email: z.email(),
  })

  async validate(input: ForgotPasswordUseCase.Input): Promise<ForgotPasswordUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
