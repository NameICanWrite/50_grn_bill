import { sendMail } from "./mailer.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

const rootUrl = process.env.NODE_ENV == 'production' ? process.env.ROOT_URL : 'http://localhost:5000'

export async function sendEmailConfirmation(email) {
  const token = jwt.sign({email}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN
  })

  let subject = 'Activation Link'
  let text = ''
  let html = `<p>Click <a href="${rootUrl}/auth/verify-email-and-create-account?token=${token}">here</a> to continue registration</p>`

  await sendMail({email, text, html, subject})
}

export async function sendEmailRecovery(email, token) {

  let subject = 'Account Recovery'
  let text = ''
  let html = `<p>Click <a href="${rootUrl}/auth/recover-account?token=${token}">here</a> to reset your password</p>`

  await sendMail({email, text, html, subject})
}

export async function sendEmailActivationCode(email, code) {
  console.log('sending email activation: ' + code)
  let subject = 'Activation Code'
  let text = ''
  let html = `<p>Your activation code is<span style="font-size: 30"> ${code}</span></p>`

  await sendMail({email, text, html, subject})
}

export async function sendEmailRecognizedByAdmin(email) {
  let subject = 'Я впізнав тебе, тримай 50 грн'
  let html = `<p>Зайди на сайт <a href="${process.env.ROOT_URL}">${process.env.ROOT_URL}</a> та тримай 50 грн</p>`
  let text = ''

  await sendMail({email, text, html, subject})
}

export async function sendEmailOrderUpdateToAdmin({_id, uid , payment: {amount, status, currency = 'UAH'}, description}) {
  id = id || _id
  description = description || await (async () => {
    let arr = []
    for (let i in products) {
      const product = await ShopItem.findById(products[i].id)
      arr.push(`${product.name} x ${products[i].count}`)
    }
    return arr.join(',')
  })()

  let subject = `Order #${id}`
  let text = `You have an order #${id}. Summary: ${description}. Price: ${amount} ${currency}.  Payment status: ${status}. 
  Client info: ${email ? `\n${email}` : ''}`
  let html = ''

  await sendMail({email: process.env.ADMIN_EMAIL, text, html, subject})
}

export function generateSixDigitCode() {
  let code = String(Math.floor(Math.random() * (10 ** 6)))
  while (code.length < 6) {
    code = '0' + code
  }
  return code
}
