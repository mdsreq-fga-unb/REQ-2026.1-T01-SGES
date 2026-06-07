import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { ForbiddenError, UnauthorizedError } from '@/application/infra/errors'
import type { UserRole } from '@/domain'
import { container } from '@/infra/container/container'

export function authMiddleware(allowedRoles: UserRole[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenService = container.TokenService
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      next(new UnauthorizedError())
      return
    }

    const token = authHeader.split(' ')[1]

    try {
      const payload = tokenService.verify(token)

      if (!allowedRoles.includes(payload.role)) {
        next(new ForbiddenError('Insufficient permissions'))
        return
      }

      res.locals.user = payload
      next()
    } catch {
      next(new UnauthorizedError())
    }
  }
}
