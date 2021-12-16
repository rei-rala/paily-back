import express from 'express'
import session from 'express-session'

//import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'

import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import middleWares from './libs/middleware'

import { mongooseSessionsURI, connectDBResources } from './libs/models/Mongoose'

import { logUserOut, updateUserImage } from './libs/controllers/users.controllers'
import { track } from './libs/controllers/track.controllers'

import { fetchCoinPrices } from './fetchRoutine/getCoins'
import { criptoPrices } from './libs/controllers/criptos.controller'

const sv = express()

dotenv.config()
const PORT = process.env.PORT !== undefined && !isNaN(parseInt(process.env.PORT)) ? +process.env.PORT : 8080


// -------------------- MIDDLEWARE --------------------
const { authMiddleware, postAuthentication, errorMiddleware, notFoundMiddleware, passport_config, headersAttachMiddleware } = middleWares


sv.use(headersAttachMiddleware);

sv.use(express.json())
sv.use(express.urlencoded({ extended: true }))
sv.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://pai-ly.vercel.app' : ['http://192.168.56.1:3000', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
}))
sv.use(cookieParser(
  process.env.SECRET
))


sv.use(session({
  store: MongoStore.create({
    mongoUrl: mongooseSessionsURI,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
} as any))

sv.use(passport.initialize())
sv.use(passport.session())
//passport
passport_config(passport)
//  -------------------- END MIDDLEWARE -------------------- 

connectDBResources()
  .then(() => sv.listen(
    PORT,
    '0.0.0.0',
    () => console.log(`Server levantado en puerto ${PORT}`))
  )
  .catch((error) => {
    console.log('Error al conectar a mongo')
    console.error(error.message)
    process.exit(1)
  })


// -------------------- TEST ROUTE --------------------
//sv.post('*', (req, res, next) => { console.log(`${req.method} ${req.originalUrl}`); console.table(req.body); console.log('-INICIO-'); next() })

// -------------------- ROUTES --------------------
sv.get('/', (_, res) => res.redirect('https://pai-ly.vercel.app'))
sv.post('/api/user/register', passport.authenticate('-register'), postAuthentication)
sv.post('/api/user/login', passport.authenticate('-login'), postAuthentication)
sv.use(authMiddleware)
sv.post('/api/user/logout', logUserOut)
// TRACKING MIDDLEWARE
sv.use(track)

sv.get('/api/user', postAuthentication)
sv.post('/api/user', updateUserImage)
sv.get('/api/cripto/latestprices', criptoPrices)

/*
// Serve static assets if in production (React)
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  sv.use(express.static('client/build'));

  sv.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
*/

sv.use(errorMiddleware)
sv.get('*', notFoundMiddleware)

if (process.env.NODE_ENV === 'production') {

  console.log('Iniciando obtencion de precios')
  const fetchingInterval = setInterval(fetchCoinPrices, 5000)
  fetchCoinPrices()
    .catch(error => {
      clearInterval(fetchingInterval)
      console.log('Error al obtener precios')
      console.error(error.message)
      process.exit(1)
    })
}
