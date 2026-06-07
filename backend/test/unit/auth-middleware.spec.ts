import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForbiddenError, UnauthorizedError } from '@/application/infra/errors'
import type { TokenPayload } from '@/application/services/token-service'
import { UserRole } from '@/domain'

const mockVerify = vi.hoisted(() => vi.fn())

vi.mock('@/infra/container/container', () => ({
  container: {
    TokenService: { verify: mockVerify },
  },
}))

const { authMiddleware } = await import('@/api/middleware/auth-middleware')

const makeReq = (authHeader?: string): Partial<Request> => ({
  headers: authHeader ? { authorization: authHeader } : {},
})

const makeRes = (): Partial<Response> => {
  const res: Partial<Response> = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.locals = {}
  return res
}

const next = vi.fn() as unknown as NextFunction

const validPayload: TokenPayload = {
  email: 'user@test.com',
  role: UserRole.TEACHER,
  name: 'Test User',
  registerCode: '123456',
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call next with UnauthorizedError when Authorization header is missing', () => {
    const req = makeReq()
    const res = makeRes()
    authMiddleware([UserRole.TEACHER])(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next with UnauthorizedError when Authorization header does not start with Bearer', () => {
    const req = makeReq('Basic sometoken')
    const res = makeRes()
    authMiddleware([UserRole.TEACHER])(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next with UnauthorizedError when token is invalid', () => {
    mockVerify.mockImplementation(() => { throw new Error('invalid token') })
    const req = makeReq('Bearer invalidtoken')
    const res = makeRes()
    authMiddleware([UserRole.TEACHER])(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next with ForbiddenError when role is not in the allowed list', () => {
    mockVerify.mockReturnValue({ ...validPayload, role: UserRole.TEACHER })
    const req = makeReq('Bearer validtoken')
    const res = makeRes()
    authMiddleware([UserRole.ADMIN])(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError))
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next and set res.locals.user for valid token and allowed role', () => {
    mockVerify.mockReturnValue(validPayload)
    const req = makeReq('Bearer validtoken')
    const res = makeRes()
    authMiddleware([UserRole.TEACHER])(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.locals!.user).toEqual(validPayload)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next when multiple roles are allowed and token role matches one', () => {
    mockVerify.mockReturnValue(validPayload)
    const req = makeReq('Bearer validtoken')
    const res = makeRes()
    authMiddleware([UserRole.ADMIN, UserRole.TEACHER])(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith()
  })
})
