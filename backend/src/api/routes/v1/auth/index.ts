import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole } from '@/domain'
import authRoute from './auth-route'
import forgotPasswordRoute from './forgot-password-route'
import resetPasswordRoute from './reset-password-route'
import logoutRoute from './logout-route'
import meRoute from './me-route'

const route = Router({ mergeParams: true })

route.post('/', authRoute)
route.post('/login', authRoute)
route.post('/forgot-password', forgotPasswordRoute)
route.post('/reset-password', resetPasswordRoute)
route.post('/logout', logoutRoute)
route.get('/me', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), meRoute)

export default route
