import { z } from 'zod'
import type { AuthUseCase } from '@/application/usecases/auth-usecase'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'

export class AuthUsecaseZodValidator implements Validator<AuthUseCase.Input> {
  private schema = z.object({
    email: z.email(),
    password: z.string().min(4).max(8),
  })

  async validate(input: AuthUseCase.Input): Promise<AuthUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) {
      throw new ValidationError(result.error.issues)
    }
    return result.data
  }
}
