import mongoose, { Model } from 'mongoose'
import { CriptoDB } from './Cryptos'
import { UserDB } from './Users'
import { IUser } from './Users'
import { ICripto } from './Cryptos'

import dotend from 'dotenv'
dotend.config()

type ModelType = Model<any, {}, {}, {}>

class MongoDatabase {
  model: ModelType

  constructor(model: ModelType) {
    this.model = model
  }

  find = async (filter = {}, fields?: string) => await this.model.find(filter, fields).lean().exec()

  findOne = async (filter = {}, fields?: string) => await this.model.findOne(filter, fields).lean().exec()

  save = async (object: IUser | ICripto) => {
    const newObject = new this.model(object)

    return await newObject.save()
  }

  updateById = async (_id: string, properties: any) => {

    if (!_id) { throw 'Ingrese un ID' }
    if (!properties) { throw 'Ingrese propiedad/es para actualizar' }

    return await this.model.findByIdAndUpdate({ _id }, { ...properties }).exec()

  }

  deleteById = async (_id: string) => await this.model.findOneAndDelete({ _id }).exec()
}

const mongooseURI = (db: string) => `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@pailycluster.ghnhh.mongodb.net/${db}?retryWrites=true&w=majority`

export const connectDBResources = async () => await mongoose.connect(mongooseURI("paily"))
export const mongooseSessionsURI = mongooseURI("pailySessions")


export const closeConnectionToDb = async () => await mongoose.connection.close()
export const CriptosDB = new MongoDatabase(CriptoDB)
export const UsersDB = new MongoDatabase(UserDB)