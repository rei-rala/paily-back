import { Request, Response, NextFunction } from "express"
import { CriptosDB, CriptoPricesDB } from "../models"


export const getCriptoDB = (_: Request, res: Response, next: NextFunction) => {

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
  const token = req.query.token ?? ''

  CriptoPricesDB.findLatest()
    .then(([latest]: any) => {
      delete latest._id; delete latest.__v

      if (token && token !== '') {

        const found = latest.details.find((x: any) => x.token === token)
        // console.log(found)
        found
          ? res.status(200).send(found)
          : next({ status: 404, message: 'No encontramos el token', token })

      } else {
        // console.log(latest)
        res.status(200).send(latest)
      }
    })
    .catch(message => next({ status: 500, message }))
}