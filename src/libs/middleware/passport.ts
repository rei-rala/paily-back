import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { UsersDB } from '../models/Mongoose'
import REGEX from '../../utils/regex'
import { hashString, compareVsEncrypted } from '../../utils/encryption'
import { v4 } from 'uuid'

export const passport_init = (pssp: PassportStatic) => {
  pssp.use('-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, username, password, done) => {

      try {
        await UsersDB.findOne({ email: username })
          .then(async user => {
            if (user) {
              return done(null, false, { message: `Ya existe usuario con email ${username}` })
            } else if (!username || !password) {
              return done(null, false, { message: 'Completar todos los campos' })
            } else if (REGEX.emailStronger.test(username) === false || REGEX.password.test(password) === false) {
              return done(null, false, { message: 'Compruebe los datos ingresados' })
            } else {
              await hashString(password)
                .then(hashedPassword => UsersDB.save({
                  id: v4(),
                  email: username,
                  password: hashedPassword,
                  image: 'No image',
                  balances: []
                }))
                .then(userCreated => {
                  console.log('--User registered--')
                  const { password, __v, _id, ...USER } = userCreated // Removing password and other fields
                  return done(null, USER)
                })
                .catch(error => done(error))
            }
          })
      } catch (error) {
        console.log('Err en REGISTER')
        console.log(error)
        return done(null, false, { message: `Error al crear usuario\n ${error}` })
      }
    }
  ))

  pssp.use('-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, username, password, done) => {
      try {
        await UsersDB
          .findOne({ email: username })
          .then(async foundUser => {
            if (!foundUser) {
              return done(null, false, { message: `${username} no existe!` })
            } else {
              await compareVsEncrypted(password, foundUser.password)
                .then(isPasswordOK => {
                  if (isPasswordOK) {
                    console.log('--User logged in--')
                    const { password, __v, _id, ...USER } = foundUser // Removing password and other fields
                    done(null, USER)
                  } else {
                    done(null, false, { message: `Contraseña incorrecta para ${username}` })
                  }
                }
                )
            }
          })
      }
      catch (error) {
        console.log('Err en LOGIN')
        console.log(error)
        return done(null, false, { message: 'Error no identificado en log in\n' + error })
      }
    }
  ))

  pssp.serializeUser(
    (user: any, done: (...args: any) => void) => {
      done(null, user)
    })
  pssp.deserializeUser(
    (user: any, done: (...args: any) => void) => {
      UsersDB.findOne({ id: user.id })
        .then(user => done(null, user))
        .catch(error => {
          console.log('Error deserializeUser')
          done(error)
        })
    })
}

export default passport_init