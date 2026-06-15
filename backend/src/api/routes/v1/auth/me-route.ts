import type { Request, Response } from 'express'
import { container } from '@/infra/container/container'
import { UserRole } from '@/domain'

export default async function (req: Request, res: Response) {
  const tokenPayload = res.locals.user
  
  if (!tokenPayload) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await container.UserRepository.findByEmail(tokenPayload.email)
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === UserRole.ADMIN ? 'admin' : 'volunteer',
  })
}
