import { AppError } from './app-error'

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message)
    this.name = 'ConflictError'
  }
}
