import type { ErrorRequestHandler } from 'express'
import { AppError } from '@/application/infra/errors'
import { ValidationError } from '@/application/infra/services/shared/validation-error'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ errors: err.issues })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  res.status(500).json({ message: 'Internal server error' })
}
