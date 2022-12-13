import express from 'express'
import dotenv from 'dotenv'

import imageRouter from './image/imageRouter.js'
import authRouter from "./auth/authRouter.js"
import userRouter from "./user/userRouter.js"
import { decodeAuthToken } from './utils/auth/jwt.utils.js'
import postRouter from './post/postRouter.js'
import titleRouter from './title/titleRouter.js'
import priceRouter from "./price/priceRouter.js"
import rewardRouter from './reward/rewardRouter.js'

const router = express.Router()


router.use(express.json());
router.use(express.urlencoded({extended: true}))



router.use('/image', imageRouter)
router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use('/post', postRouter)
router.use('/title', titleRouter)
router.use('/price', priceRouter)
router.use('/reward', rewardRouter)

// router.get('/send1USDT', (req, res, next) => {
//     const usdtTestAddress =
//     const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
//     const Web3 = require("web3");
//     const Tx = require('ethereumjs-tx');

//     // Create connection with test net
//     var web3=new Web3("Infura API endpoint")

//     var contractAbi = usdtAbi //ABI in JSON format
//     var contractAddress = Contract_Address

//     var sender = Sender_Address
//     var private = Sender_privatekey

//     var receiver = Reciever_Address
//     var amountInDecimal = 1 //Amount of token



// const myContract = new web3.eth.Contract(contractAbi, contractAddress);
// var privateKey = new Buffer(private, 'hex')

// var txObject = {};
// txObject.nonce = web3.utils.toHex(result);
// txObject.gasLimit = web3.utils.toHex(90000);

// txObject.gasPrice = web3.utils.toHex(10);
// txObject.to = contractAddress;
// txObject.from = sender;
// txObject.value = '0x';

// // Calling transfer function of contract and encode it in AB format
// txObject.data = myContract.methods.transfer( receiver, web3.utils.toHex(
// web3.utils.toWei(amountInDecimal.toString(), "ether"))).encodeABI();

// //Sign transaction before sending
// var tx = new Tx(txObject);
// tx.sign(privateKey);
// var serializedTx = tx.serialize();
// web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
// .on('transactionHash', ((data) => {
//          console.log(data);
//    }));
// }).catch(err => {
//    console.log(err);
// })
// })

router.get('/', (req, res) => {

    res.send('root path0')
})

router.post('/', (req, res) => {
    console.log('hello')
    console.log('the body is')
    console.log(req.body)
    console.log('sending response...')
    res.status(200).send()
})





export default router