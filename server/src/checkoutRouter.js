import express from 'express'
import { isAdmin } from '../controllers/authController.js'
import { createAfterPaymentOrder, createOnlinePaymentOrder, getAllOrders, getUserOrders, receivePaymentWayforpay } from '../controllers/checkoutController.js'
import { decodeAuthToken, getUserByDecodedId } from './utils/auth/jwt.utils.js'

const checkoutRouter = express.Router()

checkoutRouter
  .post('/create-online-payment-order', decodeAuthToken, getUserByDecodedId, createOnlinePaymentOrder)
  .post('/create-after-payment-order', decodeAuthToken, getUserByDecodedId, createAfterPaymentOrder)
  .post('/update-online-payment', receivePaymentWayforpay)
  .get('/user-orders', decodeAuthToken, getUserByDecodedId, getUserOrders)
  .get('/all-orders', decodeAuthToken, isAdmin, getAllOrders)

export default checkoutRouter