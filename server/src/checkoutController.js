import ShopItem from "../models/shopItem.js"
import {
    isValidPurchaseWayforpay,
    parseWayforpayBody,
    signProductsPurchaseWayforpay
} from "./utils/pay.utils.js"
import dotenv from 'dotenv'
import localtunnel from 'localtunnel'
import axios from 'axios'
import Order from "../models/order.js"
import {
    sendEmailOrderUpdate, sendEmailOrderUpdateToAdmin
} from "./utils/email/email.utils.js"
import querystring from 'node:querystring'
import novaposhta from "novaposhta"
import {
    createSimpleDeliveryNovaposhta,
    novaposhtaApi
} from "../configs/delivery.js"
import User from '../models/user.js'


dotenv.config()

async function checkoutProducts(products) {
    let totalPrice = 0
    let totalWeightKG = 0
    let totalVolumeM3 = 0
    let checkedProducts = []

    for (let i in products) {
        const { id, count } = products[i]
        const { name, price, weight, volume, size } = await ShopItem.findById(id)

        checkedProducts[i] = { name, price, count, id, weight, volume, size }

        totalPrice += price * count
        totalWeightKG += weight * count
        totalVolumeM3 += volume * count
    }
    if (process.env.NODE_ENV != 'production') totalPrice = 2.50

    let description = ''
    checkedProducts.forEach(product => {
        description += `${product.name} ${product.size} x ${product.count}`
    })

    return {
        totalPrice,
        totalWeightKG,
        totalVolumeM3,
        checkedProducts,
        description
    }
}




export async function createAfterPaymentOrder(req, res, next) {
    let { name,
        phone,
        email,
        products,
        deliveryService,
        destination //generated via same deliveryService api on frontend
    } = req.body
    const user = req.user

    //filter unused props
    destination = (() => {
        const approvedArray = [
            'RecipientCityName',
            'SettlementType',
            'RecipientArea',
            'RecipientAreaRegions',
            'RecipientAddressName',
            'RecipientHouse',
            'RecipientFlat',
        ]
        const filtered = { ...destination }
        for (let i in filtered) {
            if (!approvedArray.includes(i)) delete filtered[i]
        }
        return filtered
    })()

    if (user) {
        email = email || user.email
        products = (Array.isArray(products) && products.length > 0) ? products : user.cart
    }
    if (!phone) return res.status(400).send('You should give a valid phone number')
    if (!name) return res.status(400).send('You should give your name')
    if (!deliveryService) deliveryService = 'novaposhta'
    if (!(Array.isArray(products) && products.length > 0)) return res.status(400).send('You should choose some products')

    const {
        totalPrice,
        totalWeightKG,
        totalVolumeM3,
        checkedProducts,
        description
    } = await checkoutProducts(products)

    try {
        const parcel = await createSimpleDeliveryNovaposhta({
            phone,
            description,
            name,
            weight: totalWeightKG,
            volume: totalVolumeM3,
            cost: totalPrice,
            destination,
            isPayed: true,
        })
    } catch (err) {return res.status(500).send(err.message)}

    

    let order = new Order({
        client: { phone, email, name, userId: user?.id },
        payment: { amount: totalPrice, method: 'afterpayment'},
        delivery: { deliveryService, ...parcel },
				products: checkedProducts.map(item => ({
					id: item.id,
					count: item.count
				})),
				description,
				weight: totalWeightKG,
				volume: totalVolumeM3,
    })
        await sendEmailOrderUpdateToAdmin(order)
		if (order.client.email) await sendEmailOrderUpdate(order)
    await order.save()
		await User.findByIdAndUpdate(user._id, {cart: []})
    return res.send('order created successfully')
}





export async function createOnlinePaymentOrder(req, res, next) {
		let { name,
				phone,
				email,
				products,
				deliveryService,
				destination //generated via same deliveryService api on frontend
		} = req.body
		const user = req.user

		//filter unused props
		destination = (() => {
				const approvedArray = [
						'RecipientCityName',
						'SettlementType',
						'RecipientArea',
						'RecipientAreaRegions',
						'RecipientAddressName',
						'RecipientHouse',
						'RecipientFlat',
				]
				const filtered = { ...destination }
				for (let i in filtered) {
						if (!approvedArray.includes(i)) delete filtered[i]
				}
				return filtered
		})()

		if (user) {
			email = email || user.email
			products = (Array.isArray(products) && products.length > 0) ? products : user.cart
		}

		if (!phone) return res.status(400).send('You should give a valid phone number')
		if (!(email)) return res.status(400).send('Email is required')
		if (!name) return res.status(400).send('You should give your name')
		if (!deliveryService) deliveryService = 'novaposhta'
		if (!(Array.isArray(products) && products.length > 0)) return res.status(400).send('You didnt send any products!!')


		const {
				totalPrice,
				totalWeightKG,
				totalVolumeM3,
				checkedProducts,
				description
		} = await checkoutProducts(products)

		const currency = 'UAH'
		const orderDate = Math.round(Date.now() / 1000)
console.log('destination is:' +  destination)
    const order = new Order({
        client: {
            phone,
            email,
            name,
            userId: user._id
        },
        payment: {
            status: 'pending',
            method: 'online',
            amount: totalPrice,
            currency
        },
				delivery: {
					nextDestination: destination,
					deliveryService
				},
        products: checkedProducts.map(item => ({
            id: item.id,
            count: item.count
        })),
				description,
				weight: totalWeightKG,
				volume: totalVolumeM3,
    })
    await order.save()

    const orderReference = order._id
    const merchantDomainName = process.env.NODE_ENV == 'production' ? process.env.ROOT_URL : 'www.market.ua'
    const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT


    const merchantSignature = signProductsPurchaseWayforpay({
        products: checkedProducts,
        totalPrice,
        orderReference,
        orderDate,
        merchantDomainName,
        merchantAccount,
        currency
    })

    //not signed data
    const serviceUrl = (process.env.NODE_ENV == 'production' ? process.env.ROOT_URL : (await localtunnel({
        port: 5000
    })).url) + '/checkout/update-online-payment/'
		// const serviceUrl = 'https://eo7yt2cotksuk7w.m.pipedream.net'
		
		
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
        products: checkedProducts,

        paymentSystems,
        serviceUrl,
        // deliveryList,
        apiVersion,
    })
}

const pendingPrivat24_1 = {
    merchantAccount: 'test_merch_n1',
    orderReference: 'ORDER1652550120600-2692',
    merchantSignature: 'a84b1f676331010abf2112f3822641c3',
    amount: 2.5,
    currency: 'UAH',
    authCode: '',
    email: 'some@mail.com',
    phone: '380992856055',
    createdDate: 1652550122,
    processingDate: 1652550172,
    cardPan: '',
    cardType: null,
    issuerBankCountry: 'Unknown bank country.',
    issuerBankName: 'Unknown bank name.',
    recToken: '',
    transactionStatus: 'Approved',
    reason: 'Ok',
    reasonCode: 1100,
    fee: 0.06,
    paymentSystem: 'privat24',
    acquirerBankName: 'WayForPay',
    clientName: 'Вадим Баранівський'
}

const successPrivat24_1 = {
    merchantAccount: 'test_merch_n1',
    orderReference: 'ORDER1652549832581-5534',
    merchantSignature: '3a65b4d200d5246f51bce9a953705a09',
    amount: 2.5,
    currency: 'UAH',
    authCode: '',
    email: 'some@mail.com',
    phone: '380992856055',
    createdDate: 1652549833,
    processingDate: 1652550183,
    cardPan: '',
    cardType: null,
    issuerBankCountry: 'Unknown bank country.',
    issuerBankName: 'Unknown bank name.',
    recToken: '',
    transactionStatus: 'Approved',
    reason: 'Ok',
    reasonCode: 1100,
    fee: 0.06,
    paymentSystem: 'privat24',
    acquirerBankName: 'WayForPay',
    clientName: 'Вадим Баранівський'
}

// Рядок, що підлягає HMAC_MD5, генерується шляхом конкатенації парамаетров 
// merchantAccount, orderReference, amount, 
// currency, authCode, cardPan, 
// transactionStatus, reasonCode 
// розділених ";" (крапка з комою) в кодуванні UTF-8

export async function receivePaymentWayforpay(req, res, next) {
    try {

        // req.body[JSON.stringify(pendingPrivat24_1)] = ''

        const data = JSON.parse(req.rawrawBody)

        if (!isValidPurchaseWayforpay({
                ...data
            })) {
            console.log('purchase is invalid')
            return res.status(400).send('Purchase invalid')
        }

        const order = await Order.findById(data.orderReference)
				const prevStatus = order.payment.status
        order.payment.status = data.transactionStatus.toLowerCase()

				
        if (prevStatus !== 'approved' && order.payment.status === 'approved') {
            if (order.delivery.deliveryService == 'novaposhta') {
							const parcel = (await createSimpleDeliveryNovaposhta({
								phone: order.client.phone,
								description: order.description,
								name: order.client.name,
								weight: order.weight,
								volume: order.volume,
								cost: order.payment.amount,
								destination: order.delivery.nextDestination,
								isPayed: false,
							})).data[0]
							order.delivery = {...order.delivery, ...parcel}
							delete order.delivery.nextDestination
						}
						await User.findByIdAndUpdate(order.client.userId, {cart: []})
						if (order.client.email) await sendEmailOrderUpdate(order)
                        await sendEmailOrderUpdateToAdmin(order)
        }

        await order.save()
        return res.send(`order ${order.payment.status}. id: ${order._id}`)

    } catch (err) {
        console.log(err)
        res.status(400).send(err.message)
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