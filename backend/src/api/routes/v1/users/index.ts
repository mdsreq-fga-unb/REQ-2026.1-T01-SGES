import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole } from '@/domain'
import createUserRoute from './create-user-route'
import deleteUserRoute from './delete-user-route'
import listUsersRoute from './list-users-route'

const router = Router({ mergeParams: true })

router.get('/', authMiddleware([UserRole.ADMIN]), listUsersRoute)
router.post('/', authMiddleware([UserRole.ADMIN]), createUserRoute)
router.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteUserRoute)

export default router
