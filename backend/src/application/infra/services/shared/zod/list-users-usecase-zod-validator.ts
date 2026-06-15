import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { ListUsersUseCase } from '@/application/usecases/list-users-usecase'

export class ListUsersUsecaseZodValidator implements Validator<ListUsersUseCase.Input> {
  private schema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
  })

  async validate(input: ListUsersUseCase.Input): Promise<ListUsersUseCase.Input> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
