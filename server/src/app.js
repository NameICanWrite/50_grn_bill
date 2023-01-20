import express from 'express'

import cors from 'cors'
import helmet from 'helmet';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cron from 'node-cron'


import router from './router.js'
import connectDB from './utils/connectDB.js';
import bodyParser from 'body-parser';
import { checkAllUsersNamesForBeingFreelanceInProject } from './reward/rewardController.js';
import Settings from './settings/settings.js';
import axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent'

process.setMaxListeners(0)

dotenv.config()

await connectDB()


// const port = process.env.PORT || 8080
const port = process.env.NODE_ENV == 'production' ? 8080 : 5000

const app = express()
// app.use((req,res,next) => {
//   console.log(req.body)
//   // req.rawrawBody = '';

//   // req.on('data', function(chunk) { 
//   //   req.rawrawBody += chunk;
//   // });
//   // console.log(1)
//   // req.on('end', function() {
//   //   console.log(req.rawrawBody)
//   //   next();
//   // });
// })
app.use(cors({
    origin: ["https://usedideas.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true
}))

//wayforpay sends wrong headers... raw body is needed to fix that
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawrawBody = buf.toString(encoding || 'utf8');
  }
}
app.use(express.json())
app.use(express.urlencoded({
  verify: rawBodySaver, 
  extended:true}))





app.use(cookieParser())
// app.use(bodyParser.json({ verify: rawBodySaver, limit: '50mb' }));
// app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true, limit: '50mb'  }));
// app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*', limit: '50mb'  }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: 50 * 1024 * 1024
}))
app.use(helmet())
app.get('/', (req, res) => {
  console.log('get root');
  res.send('123')
})
app.get('/test', async (req, res) => {
//   const fetch = require('node-fetch');
  // const HttpsProxyAgent = require('https-proxy-agent');
  
  
  // (async () => {
  //     const proxyAgent = new HttpsProxyAgent('http://46.250.171.31:8080');
  //     const response = await fetch('https://httpbin.org/ip?json', { agent: proxyAgent});
  //     const body = await response.text();
  //     console.log(body);
  // })();
const httpsAgent = new HttpsProxyAgent({host: "185.238.229.167", port: "50100", auth: "vadimbaranivsky83:uvskus9Z9K"})

//use axios as you normally would, but specify httpsAgent in the config
let axiosProxy = axios.create({httpsAgent});
const currentIp = (await axiosProxy.get('https://api.ipify.org')).data
console.log('current ip is ' + currentIp);
const geopay = ((await axiosProxy.get('https://geo-pay.net')).data).substring(0, 100)
console.log(geopay);
res.send(currentIp)
})

app.head('/ping', (req, res) => {
  console.log('ping');
  res.send()
})

app.use('/', router)




app.listen(port, () => console.log(`Listening on port ${port}`))

cron.schedule('*/5 * * * *', async () => await checkAllUsersNamesForBeingFreelanceInProject())
const localSettings = await Settings.find({})

if (!localSettings || localSettings.length == 0) {
  await Settings.create({
    spinPrice: 2.5,
    whitelistedUsers: [],
    receivedRewardUsers: []
  })
}

