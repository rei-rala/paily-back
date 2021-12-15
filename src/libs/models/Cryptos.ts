import { Schema, model } from 'mongoose'

export interface IBalance {
  token: string,
  balance: number
}


export interface ICripto {
  name: string,
  token: string,
  image: string,
  buy: number,
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
})

export const CriptoDB = model(criptosCollection, CriptosSchema)


