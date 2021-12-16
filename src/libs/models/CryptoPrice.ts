import { Schema, model, } from 'mongoose'
import { ICriptoReduced } from './Cryptos'
const { Mixed } = Schema.Types

export interface ICriptoPrice {
  timestamp: number,
  details: ICriptoReduced[]
}

const criptoPriceCollection = 'criptoPrices'

const CriptosPriceSchema = new Schema({
  timestamp: { type: Number, required: true },
  details: { type: Mixed, required: true }
}, {
  versionKey: false
})


export const CriptoPriceDB = model(criptoPriceCollection, CriptosPriceSchema)