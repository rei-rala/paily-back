import { Response, Request, NextFunction } from "express"

export const errorMiddleware = (err: { status: number, message: string }, req: Request, res: Response, _: NextFunction) => {
  if (err === undefined || err === null) {
    console.log(`Error no definido en errorMiddleware`)
    return res.status(500).json({ message: 'Error imprevisto' })
  } else {
    console.log(`Error definido en errorMiddleware`)
    console.log(err.status, err.message)
    return res.status(err.status || 500).json({ message: err.message })
  }
}

export const notFoundMiddleware = (req: Request, res: Response, _: NextFunction) => {
  console.log(`Error 404 - ${req.method} ${req.originalUrl}`)
  return res.status(404).json({ message: 'Recurso no encontrado' })
}