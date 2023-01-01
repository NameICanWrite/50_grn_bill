import express from 'express'
import { isAdmin } from '../auth/authController.js'
import { decodeAuthToken } from '../utils/auth/jwt.utils.js'
import { isLoggedIn } from '../auth/authController.js'
import { getCurrentUserAndContinue } from '../user/userController.js'
import { clearAllOrders, getAllOrders, getUserOrderById, getUserOrders, orderSpin, receivePaymentWayforpay, receiveRandomTitle } from './titleController.js'


const titleRouter = express.Router()

titleRouter
  .get('/receive-random-title', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, 
    receiveRandomTitle
  )
  .post('/order-spins', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, 
    orderSpin
  )

  .post('/update-online-payment', receivePaymentWayforpay)

  .get('/user-orders', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, getUserOrders)
  .get('/all-orders', decodeAuthToken, isAdmin, getAllOrders)
  .get('/clear-all-orders', decodeAuthToken, isAdmin, clearAllOrders)
  .get('/spins-order/:orderId', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, getUserOrderById)
  
export default titleRouter