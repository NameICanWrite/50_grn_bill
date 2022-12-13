import Price from "../price/price.js"
import User from "../user/user.js"
import Order from "./order.js"
import {isValidPurchaseWayforpay, signProductsPurchaseWayforpay} from '../utils/pay.utils.js'
import localtunnel from 'localtunnel'
import { sendEmailOrderUpdateToAdmin } from "../utils/email/email.utils.js"

const titles = [
  'Справжній власник цього сайту',
  'Hard code and a hammer',
  'Звезда по имени User',
  'Той, хто біжить 2FA: Випробування вогнем',
  '💵 bill Gates ',
  'Людина-web',
  'Мирний диванний воїн',
  'Кіберпанк 24/7',
  'The Da Vinci Coder',
]

export async function receiveRandomTitle(req, res, next) {
  const user = req.user 

  if (user.spins < 1 && !req.auth.isAdmin) return req.status(400).send('You have zero spins. Buy some')

  user.spins--

  user.title = titles[Math.floor(Math.random() * titles.length)]
  user.didReceiveTitle = true
  await user.save()

  return res.send('Ви отримали звання "' + user.title + '"')
}




//create order to receive updates about it from wayforpay
export async function orderSpin(req, res, next) {
  let count = req.body.count
  const uid = req.auth.uid

  if (count % 1 != 0 || count < 1) return res.status(400).send('...!?')

  const { spinPrice } = await Price.findOne()
  const totalPrice = spinPrice * count

  const currency = 'UAH'
  const orderDate = Math.round(Date.now() / 1000)

  const description = 'Spin' + (count > 1 ? 's' : '') + ' x ' + count

  const order = new Order({
      uid,
      payment: {
          status: 'pending',
          amount: totalPrice,
      },
      spinsCount: count,
      description
  })
  await order.save()

  const orderReference = order._id
  const merchantDomainName = process.env.NODE_ENV == 'production' ? process.env.ROOT_URL : 'www.market.ua'
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT

  const merchantSignature = signProductsPurchaseWayforpay({
      products: [{
        price: spinPrice,
        name: 'spin',
        count
      }],
      totalPrice,
      orderReference,
      orderDate,
      merchantDomainName,
      merchantAccount,
      currency
  })


  //the variables below are sent to wayforpay too. But they dont need signature

  const serviceUrl = (process.env.NODE_ENV == 'production' ? process.env.ROOT_URL : (await localtunnel({
      port: 5000
  })).url) + '/title/update-online-payment/' // for local testing use 3d-party server to receive post requests from wayforpay server


  const paymentSystems = 'card'
  const apiVersion = 1

  res.send({
      merchantSignature,
      amount: totalPrice,
      orderReference,
      orderDate,
      merchantAccount,
      merchantDomainName,
      currency,
      products: [{
        price: spinPrice,
        name: 'spin',
        count
      }],
      paymentSystems,
      serviceUrl,
      apiVersion,
  })
}




export async function receivePaymentWayforpay(req, res, next) {
  try {

      const data = JSON.parse(req.rawrawBody)

      if (!isValidPurchaseWayforpay({
              ...data
          })) {
          console.log('purchase is invalid')
          return res.status(400).send('Purchase invalid')
      }

      //check if status has changed ()
      const order = await Order.findById(data.orderReference)
      const prevStatus = order.payment.status
      order.payment.status = data.transactionStatus.toLowerCase()

      
      if (prevStatus !== 'approved' && order.payment.status === 'approved') {
          const user = await User.findById(order.uid)
          user.spins += order.spinsCount
          await user.save()
          await order.save()
          // await sendEmailOrderUpdateToAdmin({...order, email: user.email})
      }

      return res.send(`received an update on order with id ${order._id}: ${order.payment.status}`)

  } catch (err) {
      console.log(err)
      return res.status(400).send(err.message)
  }
}

export async function getAllOrders(req, res, next) {
  const orders = await Order.find({})
  res.send(orders)
}

export async function getUserOrders(req, res, next) {
  const orders = await Order.find({
      uid: req.user?.uid
  })
  res.send(orders)
}

export async function clearAllOrders(req, res, next) {
  await Order.deleteMany({})
  res.send('deleted all orders')
}

