/* import express from 'express'
import cors from 'cors'
//import compression from 'compression'

import errorMiddleware from '../libs/middleware/errorMiddleware'

export const sv = express()
export const UsersAPI = express.Router()
export const CriptoAPI = express.Router()

// Middleware
//sv.use(compression())
sv.use(express.static('public'))
sv.use(express.json({ limit: '30mb' }))
sv.use(express.urlencoded({ limit: '30mb', extended: true }))
sv.use(cors())


// Routers
sv.use('/api/users', UsersAPI)
sv.use('/api/cripto', CriptoAPI)
sv.use(errorMiddleware) */