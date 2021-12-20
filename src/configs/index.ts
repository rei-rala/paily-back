import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT !== undefined && !isNaN(+process.env.PORT) && +process.env.PORT || 8080
const NODE_ENV = process.env.NODE_ENV || 'development'
const SECRET = process.env.SECRET || ''
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''
const MONGO_USER = process.env.MONGO_USER || ''
const MONGO_PW = process.env.MONGO_PW || ''


export { PORT, NODE_ENV, SECRET, RAPIDAPI_KEY, MONGO_USER, MONGO_PW }