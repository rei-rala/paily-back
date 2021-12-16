import { Schema, model } from 'mongoose'

export interface IBalance {
  token: string,
  balance: number
}

export interface ICriptoReduced {
  name: string,
  token: string,
  buy: number
}

export interface ICripto extends ICriptoReduced {
  image: string,
  sell: number,
  timestamp: number
}


const criptosCollection = 'criptos'

const CriptosSchema = new Schema({
  name: { type: String, required: true },
  token: { type: String, required: true, max: 30 },
  image: { type: String, required: true, max: 300 },
  buy: { type: Number, required: true, maxlength: 10 },
  sell: { type: Number, required: true, maxlength: 10 },
  timestamp: { type: Number }
}, {
  versionKey: false
})

export const CriptoDB = model(criptosCollection, CriptosSchema)


