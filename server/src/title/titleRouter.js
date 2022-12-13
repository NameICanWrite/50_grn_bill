import express from 'express'
import { isAdmin } from '../auth/authController.js'
import { decodeAuthToken } from '../utils/auth/jwt.utils.js'
import { isLoggedIn } from '../auth/authController.js'
import { getCurrentUserAndContinue } from '../user/userController.js'
import { clearAllOrders, getAllOrders, getUserOrders, orderSpin, receivePaymentWayforpay, receiveRandomTitle } from './titleController.js'


const titleRouter = express.Router()

titleRouter
  .get('/receive-random-title', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, 
    receiveRandomTitle
  )
  .post('/order-spin', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, 
    orderSpin
  )

  .post('/update-online-payment', receivePaymentWayforpay)

  .get('/user-orders', decodeAuthToken, getCurrentUserAndContinue, getUserOrders)
  .get('/all-orders', decodeAuthToken, isAdmin, getAllOrders)
  .get('/clear-all-orders', decodeAuthToken, isAdmin, clearAllOrders)
  
export default titleRouter