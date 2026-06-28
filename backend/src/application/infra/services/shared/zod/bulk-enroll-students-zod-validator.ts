import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { BulkEnrollStudentsInput } from '@/application/usecases/bulk-enroll-students-usecase'

export class BulkEnrollStudentsZodValidator implements Validator<BulkEnrollStudentsInput> {
  private schema = z.object({
    classId: z.string().uuid(),
    studentIds: z.array(z.string().uuid()).min(1),
  })

  async validate(input: BulkEnrollStudentsInput): Promise<BulkEnrollStudentsInput> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
