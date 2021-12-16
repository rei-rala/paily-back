import { Request, Response, NextFunction, Express } from 'express';

interface IAuthUser extends Express.User {
  email?: any,
  password?: any,
  _id?: any,
  __v?: any,
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next()
  } else {
    next({ status: 401, message: 'Usuario no logueado' });
  }
}

export function postAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    let user: IAuthUser = req.user;

    delete user.password
    delete user._id
    delete user.__v

    res.status(200).json(req.user);
  } else {
    next({ status: 401, message: 'Usuario no logueado' });
  }
}