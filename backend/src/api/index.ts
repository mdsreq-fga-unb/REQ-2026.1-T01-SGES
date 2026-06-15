import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { errorHandler } from './middleware/error-handler'
import Health from './routes/health'
import { routes } from './routes'

const api = express()

api.use(cors({ origin: '*' }))
api.use(helmet({}))
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

api.get('/health', Health)
api.use(routes)
api.use(errorHandler)

export { api }