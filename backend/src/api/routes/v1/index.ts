import { Router } from 'express'
import auth from './auth'
import users from './users'

const router = Router()

router.use('/auth', auth)
router.use('/users', users)

export { router as routes }