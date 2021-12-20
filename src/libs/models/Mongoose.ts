import mongoose, { Model } from 'mongoose'
import { IUser } from './Users'
import { ICripto } from './Cryptos'
import { ICriptoPrice } from './CryptoPrice'
import { MONGO_USER, MONGO_PW } from '../../configs/index'

type ModelType = Model<any, {}, {}, {}>

export class MongoDatabase {
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

  findTopN = async (filter = {}, fields?: string, limit?: number) => {
    return this.model.find(filter, fields).limit(limit ?? 10).lean().exec()
  }

  findLatest = async (fields?: string, limit?: number) => {
    return this.model.find({}, fields ?? {}).sort({ "timestamp": -1 }).limit(limit ?? 1).lean().exec()
  }

  save = async (object: IUser | ICripto | ICriptoPrice) => {
    const newObject = new this.model(object)

    return newObject.save()
  }

  saveMany = async (arrayOfObjects: IUser[] | ICripto[] | ICriptoPrice[]) => {
    return this.model.insertMany(arrayOfObjects)
  }

  updateById = async (_id: any, properties: any) => {

    if (!_id) { throw 'Ingrese un ID' }
    if (!properties) { throw 'Ingrese propiedad/es para actualizar' }

    return this.model.findByIdAndUpdate({ _id }, { ...properties }, { new: true }).exec()
  }

  deleteById = async (_id: any) => {
    return this.model.findOneAndDelete({ _id }).exec()
  }
}

const mongooseURI = (db: string) => `mongodb+srv://${MONGO_USER}:${MONGO_PW}@pailycluster.ghnhh.mongodb.net/${db}?retryWrites=true&w=majority`

export const connectDBResources = async () => mongoose.connect(mongooseURI("paily"))
export const closeConnectionToDb = async () => mongoose.connection.close()
export const mongooseSessionsURI = mongooseURI("pailySessions")