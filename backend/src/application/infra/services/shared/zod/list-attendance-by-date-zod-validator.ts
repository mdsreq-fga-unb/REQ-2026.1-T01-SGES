import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'
import type { ListAttendanceByDateInput } from '@/application/usecases/list-attendance-by-date-usecase'

export class ListAttendanceByDateZodValidator implements Validator<ListAttendanceByDateInput> {
  private schema = z.object({
    classId: z.string().uuid(),
    date: z.coerce.date(),
  })

  async validate(input: ListAttendanceByDateInput): Promise<ListAttendanceByDateInput> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) throw new ValidationError(result.error.issues)
    return result.data
  }
}
