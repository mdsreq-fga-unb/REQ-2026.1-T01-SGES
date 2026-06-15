import type { Request, Response } from 'express'
import { container } from '@/infra/container/container'

export default async function (req: Request, res: Response) {
  await container.ResetPasswordUsecase.execute({ ...req.body })
  return res.status(200).json({ message: 'Password changed successfully' })
}
