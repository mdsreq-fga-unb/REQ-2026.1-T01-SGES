import { z } from 'zod'
import { UserRole } from '@/domain'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { UpdateUserUseCase } from '@/application/usecases/update-user-usecase'

export class UpdateUserUsecaseZodValidator implements Validator<UpdateUserUseCase.Input> {
  private schema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
  })

  async validate(input: UpdateUserUseCase.Input): Promise<UpdateUserUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
