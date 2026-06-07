import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole } from '@/domain'
import createUserRoute from './create-user-route'

const router = Router({ mergeParams: true })

router.post('/', authMiddleware([UserRole.ADMIN]), createUserRoute)

export default router
