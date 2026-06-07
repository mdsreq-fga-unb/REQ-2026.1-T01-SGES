import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { DeleteUserUseCase } from '@/application/usecases/delete-user-usecase'

export class DeleteUserUsecaseZodValidator implements Validator<DeleteUserUseCase.Input> {
  private schema = z.object({
    id: z.string().uuid(),
  })

  async validate(input: DeleteUserUseCase.Input): Promise<DeleteUserUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
