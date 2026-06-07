import { Router } from 'express'
import authRoute from './auth-route'
import forgotPasswordRoute from './forgot-password-route'
import resetPasswordRoute from './reset-password-route'

const route = Router({ mergeParams: true })

route.post('/', authRoute)
route.post('/forgot-password', forgotPasswordRoute)
route.post('/reset-password', resetPasswordRoute)

export default route
