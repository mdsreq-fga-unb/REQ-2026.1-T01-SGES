import type { Request, Response } from 'express'
import { container } from '@/infra/container/container'
import { UserRole } from '@/domain'

export default async function (req: Request, res: Response) {
  const output = await container.AuthUsecase.execute({ ...req.body })
  
  const tokenPayload = container.TokenService.verify(output.token)
  const user = await container.UserRepository.findByEmail(tokenPayload.email)
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  return res.status(200).json({
    token: output.token,
    accessToken: output.token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === UserRole.ADMIN ? 'admin' : 'volunteer',
    },
  })
}
