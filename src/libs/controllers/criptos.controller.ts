import { Request, Response, NextFunction } from "express"
import { CriptosDB, CriptoPricesDB } from "../models/Mongoose"


export const getCriptoDB = (req: Request, res: Response, next: NextFunction) => {

  CriptosDB.find()
    .then((x: any) => { res.status(200).json(x) })
    .catch(message => { next({ status: 400, message }) })
}


export const createNewCripto = (req: Request, res: Response, next: NextFunction) => {
  const { name, token, image, buy, sell } = req.body

  try {
    if (!name || !token || !image || !buy || !sell) {
      throw 'Completar todos los campos'
    } else {
      CriptosDB.save({
        name,
        token,
        image,
        buy: parseInt(buy),
        sell: parseInt(sell),
        timestamp: new Date().getTime()
      })
        .then(newObj => { res.status(201).json({ message: 'Cripto añadida', id: newObj.id }) })
        .catch(error => { throw error })
    }
  } catch (message) {
    next({
      status: 400,
      message
    })
  }
}


export const criptoPrices = async (req: Request, res: Response, next: NextFunction) => {
  //const query = req.query

  CriptoPricesDB.findLatest()
    .then(latest => res.status(200).send(latest))
    .catch(message => next({ status: 500, message }))
}