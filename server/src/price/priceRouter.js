import express from 'express'
import { isAdmin } from '../auth/authController.js'
import { decodeAuthToken } from '../utils/auth/jwt.utils.js'
import Price from './price.js'

const priceRouter = express.Router()

priceRouter
  .post('/', decodeAuthToken, isAdmin, async (req, res) => {
    const newPrices = req.body

    let prices = (await Price.findOne()) || (Price.create({}))

    prices.spinPrice = newPrices.spinPrice
    
    await prices.save()

    res.send(prices)
  })
  
export default priceRouter
