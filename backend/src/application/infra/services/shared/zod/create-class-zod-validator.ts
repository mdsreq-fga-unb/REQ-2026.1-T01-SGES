import { z } from 'zod'
import { ValidationError } from '../validation-error'
import type { Validator } from '../validator'

export type CreateClassInput = {
  nomeCurso: string
  horario: string
  diaSemana: string
  livrosEstudados?: string | null
  vagasLimite?: number | null
  instructorIds?: string[]
}

export class CreateClassZodValidator implements Validator<CreateClassInput> {
  private schema = z.object({
    nomeCurso: z.string().min(1, 'Nome do curso é obrigatório.'),
    horario: z.string().min(1, 'Horário é obrigatório.'),
    diaSemana: z.string().min(1, 'Dia da semana é obrigatório.'),
    livrosEstudados: z.string().nullable().optional(),
    vagasLimite: z
      .number()
      .int('O número de vagas deve ser um valor inteiro.')
      .min(1, 'O limite de vagas deve ser maior ou igual a 1.')
      .nullable()
      .optional(),
    instructorIds: z.array(z.string().uuid('ID de instrutor inválido.')).optional(),
  })

  async validate(input: CreateClassInput): Promise<CreateClassInput> {
    const result = await this.schema.safeParseAsync(input)
    if (!result.success) {
      throw new ValidationError(result.error.issues)
    }
    return result.data as CreateClassInput
  }
}
