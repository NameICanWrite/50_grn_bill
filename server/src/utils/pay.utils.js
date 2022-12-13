import dotenv from 'dotenv'
import crypto from 'crypto'
import axios from 'axios'


// dotenv.config()

// Строка, подлежащая HMAC_MD5, генерируется путем конкатенации параметров merchantAccount, 
// merchantDomainName, orderReference, orderDate, amount, currency, 
// productName[0], productName[1]..., productName[n], 
// productCount[0], productCount[1],..., productCount[n], 
// productPrice[0], productPrice[1],..., productPrice[n]  
// разделенных “;” (точка с запятой) в кодировке UTF-8

export function signProductsPurchaseWayforpay({
products, 
    totalPrice, 
    orderReference, 
    orderDate, 
    merchantDomainName, 
    merchantAccount,
    currency
}) {

let str = [merchantAccount, merchantDomainName, orderReference, orderDate, totalPrice, currency].join(';')
products.forEach(cartItem => {
    str += ';' + cartItem.name
})
products.forEach(cartItem => {
    str += ';' + cartItem.count
})
products.forEach(cartItem => {
    str += ';' + cartItem.price
})

const hash = crypto.createHmac('md5', process.env.WAYFORPAY_MERCHANT_SECRET_KEY).update(str).digest('hex');

return hash
}



export function isValidPurchaseWayforpay({
    merchantSignature,
    merchantAccount, orderReference, amount, 
    currency, authCode, cardPan, 
    transactionStatus, reasonCode
}) {
    const str = [merchantAccount, orderReference, amount, currency, authCode, cardPan, transactionStatus, reasonCode].join(';')
    const hash = crypto.createHmac('md5', process.env.WAYFORPAY_MERCHANT_SECRET_KEY).update(str).digest('hex');

    if (merchantSignature === hash) {
        return true
    } else {
        return false
    } 
}

export function parseWayforpayBody(raw) {
    let parsed
	for (let i in raw) {
		parsed = JSON.parse(i)
		break
	}

    return parsed
}




