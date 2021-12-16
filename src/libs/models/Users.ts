import { Schema, model } from 'mongoose'
import { IBalance } from './Cryptos'

export interface IUser {
  _id?: any,
  id: string,
  email?: string,
  password?: string,
  image?: string,
  balances?: IBalance[]
}

const usersCollection = 'users'

const UsersSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true, unique: true, minlength: 5, maxlength: 50 },
  password: { type: String, required: true, minlength: 6, maxlength: 60 },
  image: { type: String, required: true, max: 300 },
  balances: {
    required: true,
    type: [{
      token: { type: String },
      balance: { type: Number },
    }]
  }
}, {
  versionKey: false
})

export const UserDB = model(usersCollection, UsersSchema)


