import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { CreateUserUseCase } from '@/application/usecases/create-user-usecase'
import { UserRole } from '@/domain'

export class CreateUserUsecaseZodValidator implements Validator<CreateUserUseCase.Input> {
  private schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum([UserRole.ADMIN, UserRole.TEACHER]),
  })

  async validate(input: CreateUserUseCase.Input): Promise<CreateUserUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) {
      throw new ValidationError(result.error.issues)
    }
    return result.data
  }
}
