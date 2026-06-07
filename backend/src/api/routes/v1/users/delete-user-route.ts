import type { Request, Response } from 'express'
import { container } from '@/infra/container/container'

export default async function (req: Request, res: Response) {
  await container.DeleteUserUsecase.execute({ id: String(req.params.id) })
  return res.status(204).send()
}
