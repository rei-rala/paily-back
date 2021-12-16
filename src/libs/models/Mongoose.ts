import mongoose, { Model } from 'mongoose'
import { CriptoDB } from './Cryptos'
import { UserDB } from './Users'
import { IUser } from './Users'
import { ICripto } from './Cryptos'

import dotend from 'dotenv'
import { CriptoPriceDB, ICriptoPrice } from './CryptoPrice'
dotend.config()

type ModelType = Model<any, {}, {}, {}>

class MongoDatabase {
  model: ModelType

  constructor(model: ModelType) {
    this.model = model
  }

  find = async (filter = {}, fields?: string) => {
    return this.model.find(filter, fields).lean().exec()
  }

  findOne = async (filter = {}, fields?: string) => {
    return this.model.findOne(filter, fields).lean().exec()
  }

  save = async (object: IUser | ICripto | ICriptoPrice) => {
    const newObject = new this.model(object)

    return newObject.save()
  }

  saveMany = async (arrayOfObjects: IUser[] | ICripto[] | ICriptoPrice[]) => {
    return this.model.insertMany(arrayOfObjects)
  }

  updateById = async (_id: string, properties: any) => {

    if (!_id) { throw 'Ingrese un ID' }
    if (!properties) { throw 'Ingrese propiedad/es para actualizar' }

    return this.model.findByIdAndUpdate({ _id }, { ...properties }).exec()
  }

  deleteById = async (_id: string) => {
    return this.model.findOneAndDelete({ _id }).exec()
  }
}

const mongooseURI = (db: string) => `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@pailycluster.ghnhh.mongodb.net/${db}?retryWrites=true&w=majority`

export const connectDBResources = async () => mongoose.connect(mongooseURI("paily"))
export const closeConnectionToDb = async () => mongoose.connection.close()
export const mongooseSessionsURI = mongooseURI("pailySessions")

export const CriptosDB = new MongoDatabase(CriptoDB)
export const UsersDB = new MongoDatabase(UserDB)
export const CriptoPricesDB = new MongoDatabase(CriptoPriceDB)