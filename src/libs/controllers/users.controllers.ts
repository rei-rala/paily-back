import { Request, Response, NextFunction } from "express"

import { UsersDB } from "../models"
import { IUser } from "../models/Users"
//import REGEX from "../../utils/regex"

declare global {
  namespace Express {
    interface User extends IUser { }
  }
}

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


export const updateUserImage = async (req: Request, res: Response, next: NextFunction) => {
  const _id = req.user?._id.toString()
  const newImage = req.body.newImage

  console.log(req.body)
  console.log('assadsa')
  _id === undefined || newImage === undefined
    ? next({ status: 400, message: 'No se recibieron suficientes parametros' })
    /*
         : !REGEX.urlFile.test(newImage)
          ? next({ status: 400, message: 'La URL ingresada no es valida' }) */
    : UsersDB.updateById(_id, { image: newImage })
      .then(updated => {
        updated
          ? res.status(202).send(updated)
          : next({ status: 409, message: `Error no identificado en actualizacion de datos` })
      })
      .catch(message => next({ message }))
}