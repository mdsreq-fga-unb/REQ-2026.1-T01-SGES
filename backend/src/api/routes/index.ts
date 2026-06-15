import { Router } from 'express'
import { routes as v1 } from './v1'

const router = Router()

router.use('/v1', v1)

export { router as routes }