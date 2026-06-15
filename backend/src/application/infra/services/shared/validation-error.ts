import type { ZodIssue } from 'zod'

export class ValidationError extends Error {
  constructor(public readonly issues: ZodIssue[]) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}
