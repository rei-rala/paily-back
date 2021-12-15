import { Request, Response, NextFunction } from "express"
import { UsersDB } from "../models/Mongoose"
import { IUser } from "../models/Users"

const testAdmin = {
  username: 'a',
  password: 'a'
}


export const logUserSuccess = (req: Request, res: Response, next: NextFunction) => {
  //console.log(req)
  const isAuthenticaded = req.isAuthenticated()
  console.log(`${isAuthenticaded ? 'Usuario logueado' : 'Usuario no logueado'} - ${req.method} ${req.originalUrl}\n logUserSuccess`)
  req.isAuthenticated()
    ? res.status(200).json(req.user)
    : next({ status: 401, message: 'No autenticado' })
}


export const logUserOut = (req: Request, res: Response, next: NextFunction) => {
  req.user && console.log('logUserOut')
  req.logout()
  res.status(200).json(true)
  console.log(req.user)
}


export const getUsersDB = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  try {
    if (username === testAdmin.username && password === testAdmin.password) {
      UsersDB.find()
        .then((x: any) => { res.status(200).json(x) })
        .catch(reason => { throw reason })
    } else {
      next({ status: 401, message: 'Credenciales incorrectas' })
    }
  }
  catch (message) {
    next({ status: 400, message })
  }
}