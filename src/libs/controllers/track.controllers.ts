import { Request, Response, NextFunction } from "express"

export const track = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.data ?? req.body)
  console.log(`${req.method} "${req.originalUrl}" | ${new Date().toLocaleString()}`)

  if (req.originalUrl === '/' && ['POST', 'post'].includes(req.method)) {
    const { body } = req
    res.status(200).json(body).end()
  } else {
    next()
  }
}