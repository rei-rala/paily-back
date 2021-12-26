import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

//import path from 'path'

import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import MongoStore from 'connect-mongo'
import passport from 'passport'

import { PORT, NODE_ENV, SECRET } from './configs'
import { mongooseSessionsURI, connectDBResources } from './libs/models/Mongoose'

import { /* authMiddleware ,*/ postAuthentication, errorMiddleware, notFoundMiddleware, passport_config, headersAttachMiddleware } from './libs/middleware'
import { logUserOut, getOtherUser, updateUserImage } from './libs/controllers/users.controllers'
import { criptoPrices } from './libs/controllers/criptos.controller'
//import { track } from './libs/controllers/track.controllers'

import { getCriptoPrices, fetchCoinPricesToDB } from './libs/services/criptoPrices'
import { criptoPricesWebSockets } from './libs/websockets'

const app = express()
const httpServer = createServer(app)


// -------------------- MIDDLEWARE --------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: NODE_ENV === 'production' ? 'https://pai-ly.vercel.app' : ['http://192.168.56.1:3000', 'http://localhost:3000', 'http://localhost:8080', 'http://192.168.0.130:3000'],
  credentials: true,
}))
app.use(cookieParser(SECRET))

app.use(headersAttachMiddleware);

app.use(session({
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
    secure: NODE_ENV === 'production',
  },
} as any))

app.use(passport.initialize())
app.use(passport.session())
//passport
passport_config(passport)
//  -------------------- END MIDDLEWARE -------------------- 

connectDBResources()
  .then(() => httpServer.listen(
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
//app.post('*', (req, res, next) => { console.log(`${req.method} ${req.originalUrl}`); console.table(req.body); console.log('-INICIO-'); next() })

// -------------------- ROUTES --------------------
app.get('/', /* (_, res) => res.redirect('https://pai-ly.vercel.app') */)
app.post('/api/user/register', passport.authenticate('-register'), postAuthentication)
app.post('/api/user/login', passport.authenticate('-login'), postAuthentication)
app.post('/api/user/logout', logUserOut)
//app.use(track)

//app.use(authMiddleware)
app.get('/api/user', postAuthentication)
app.post('/api/user', updateUserImage)
app.get('/api/user/:id', getOtherUser)
app.get('/api/cripto/latestprices', criptoPrices)

/*
// Serve static assets if in production (React path ./client/build/...)
if (NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
*/

app.use(errorMiddleware)
app.get('*', notFoundMiddleware)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
})

criptoPricesWebSockets(io)


//if (process.env.NODE_ENV !== 'production') {
console.log('Iniciando obtencion de precios')
const fetchingInterval = setInterval(fetchCoinPricesToDB, 5000)
fetchCoinPricesToDB()
  .catch(error => {
    clearInterval(fetchingInterval)
    console.log('Error al obtener precios')
    console.error(error.message)
    process.exit(1)
  })
//}
