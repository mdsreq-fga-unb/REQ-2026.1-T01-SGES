import type { Request, Response, NextFunction } from 'express'
import { container } from '@/infra/container/container'

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { name, email, role } = req.body

    const usecase = container.UpdateUserUsecase
    const output = await usecase.execute({
      id: id as string,
      name,
      email,
      role,
    })

    return res.status(200).json(output)
  } catch (err) {
    next(err)
  }
}
