import type { Request, Response } from 'express'
import { container } from '@/infra/container/container'

export default async function (req: Request, res: Response) {
  const rawPage = typeof req.query.page === 'string' ? req.query.page : undefined
  const page = rawPage ? Number(rawPage) : undefined
  const output = await container.ListUsersUsecase.execute({ page })
  return res.status(200).json(output)
}
