import axios from "axios"
import { CriptoPricesDB } from "../libs/models/Mongoose"
import moment from 'moment'

import dotenv from 'dotenv'
dotenv.config()

const OURCRIPTOS = ["bitcoin", "ethereum", "binancecoin", "solana", "cardano", "polkadot", "matic-network"]

const ourCriptoData = [
  {
    id: 'bitcoin',
    name: 'bitcoin',
    token: 'BTC',
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    buy: -1,
    sell: -1,
  },
  {
    id: "ethereum",
    "name": "Ethereum",
    "token": "ETH",
    "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    "buy": -1,
    "sell": -1,
  },
  {
    id: "binancecoin",
    "name": "Binance Coin",
    "token": "BNB",
    "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    "buy": -1,
    "sell": -1,
  },
  {
    id: "solana",
    "name": "Solana",
    "token": "SOL",
    "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    "buy": -1,
    "sell": -1,
  },
  {
    id: "cardano",
    "name": "Cardano",
    "token": "ADA",
    "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    "buy": -1,
    "sell": -1,
  },
  {
    id: "polkadot",
    "name": "Polkadot",
    "token": "DOT",
    "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
    "buy": -1,
    "sell": -1,
  },
  {
    id: "matic-network",
    "name": "Polygon",
    "token": "MATIC",
    "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    "buy": -1,
    "sell": -1,
  }
]

const coingeckoBaseUrl = "https://coingecko.p.rapidapi.com"

export const fetchCoinPrices = async () => {
  axios.get(`${coingeckoBaseUrl}/simple/price?vs_currencies=usd&ids=${OURCRIPTOS.join()}`, {
    headers: {
      'x-rapidapi-host': 'coingecko.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || ''
    }
  })
    .then(async ({ data }) => {
      return OURCRIPTOS.map(id => ({
        name: ourCriptoData.find((cd: any) => cd.id === id)?.name ?? '',
        token: ourCriptoData.find((cd: any) => cd.id === id)?.token ?? '',
        buy: +data[id].usd.toFixed(2) || -1,
      }))
    })
    .then(arrayReadyData => CriptoPricesDB.save({
      timestamp: moment().valueOf(),
      details: arrayReadyData
    }))
    .then(resp => console.log('Guardado'))
    .catch(err => console.log('Error al salvar lista de precios', err))
}