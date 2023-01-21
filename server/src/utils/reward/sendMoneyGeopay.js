import puppeteer from 'puppeteer-extra';
// import {executablePath} from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import dotenv from 'dotenv'
import { uploadFileToGoogleDrive } from '../file-upload/googleDrive.utils.js';
import fs from 'fs'
import Xvfb from 'xvfb'
import proxyChain from 'proxy-chain'

dotenv.config()



export async function sendMoneyGeopay({cardNumber = process.env.MY_CARD_NUMBER, amountToSend = '50'}) {
 console.log(123);
 
  const proxy = {
    host: '185.238.229.167:50100',
    username: 'vadimbaranivsky83',
    password: 'uvskus9Z9K'
  }

  amountToSend.toString()
  // let xvfb
  // if (process.env.NODE_ENV == 'production') {
  //   xvfb = new Xvfb()
  //   xvfb.startSync()
  // }
  const originalUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}`;

  // Return anonymized version of original URL - looks like http://127.0.0.1:45678
  const newUrl = await proxyChain.anonymizeProxy(originalUrl);


  puppeteer.use(StealthPlugin())


  const browser = await puppeteer.launch({ headless: true,  // executablePath: executablePath(), 
    // currentUserDir: "./puppeteer_user_data" 
    args: [
      // '--disable-dev-shm-usage',
      '--proxy-server=https=' + newUrl,
  ]
  });
  
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000)
  // await page.authenticate({
  //   username: proxy.user,
  //   password: proxy.pass,
  // });
  // await page.setExtraHTTPHeaders({
  //   'Proxy-Authorization': 'Basic ' + Buffer.from(`${proxy.user}:${proxy.pass}`).toString('base64')
  // });
  console.log('authenticated the page');
 
  //login to Geopay using headless browser
  try {
    
    // await page.goto('https://api.ipify.org', { waitUntil: 'networkidle0' });
    // console.log('went to ipfy api');
    // await page.goto('https://ipify.org', { waitUntil: 'networkidle0' });
    // console.log('went to ipfy');
    // await page.goto('https://proxy-seller.com', { waitUntil: 'networkidle0', timeout: 120000 })
    // console.log('went to proxy-seller');
    await page.goto('https://geo-pay.net/auth/log-in', { waitUntil: 'networkidle0' })
    console.log('went to geopay');
    // console.log('now trying to make screenshot');


    // //screenshot
    // const name = 'debugImage' + Date.now() + (Math.floor(Math.random() * 1000)).toString() + '.png'
    // const path = 'temp/' + name
    // await page.screenshot({
    //   path
    // })
    // const file = {
    //   path,
    //   name,
    //   mimetype: 'image/png'
    // }
    // const screenshotFileId = (await uploadFileToGoogleDrive(file)).id
		// // fs.unlinkSync(file.path)
    // console.log('geopay screenshot id: ' + screenshotFileId)
    
    //delete tel prefix
    await page.click('input[type=tel]')
    await page.keyboard.down('ControlLeft')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('ControlLeft')
    await page.keyboard.press('Backspace')

    //enter credentials
    await page.type('input[type=tel]', process.env.GEOPAY_TEL)
    await page.type('input[type=password]', process.env.GEOPAY_PASSWORD)
    await page.click('button[type=submit]')

    //wait for redirect
    let holdProgress = true;
    while (holdProgress) {
      await (new Promise(res => setTimeout(res, 300)))
      if (page.url().includes('/dashboard')) {
          holdProgress = false;
      }
    }

    console.log('Logged in to Geopay')
  } catch(err) {
    console.log(err)
    throw new Error('Failed to log in to Geopay')
  }




  //try to withdraw assets
  // await page.goto('https://geo-pay.net/dashboard', { waitUntil: 'networkidle0' });
  await page.goto('https://geo-pay.net/dashboard/withdrawal', { waitUntil: 'networkidle0' });
  console.log('went to withdrawal page');
  await page.type('input[name=amount]', amountToSend)
  await page.type('input[name=cardNumber]', cardNumber)
  console.log('entered amount and the card number');
  // console.log('bug fixed');
  // throw Error('bug fixed')
  await page.click('button[type=submit]')
 
  try {
    const [unSuccessfulParagraph] = await page.$x("//p[contains(., 'Enter the value within the range')]");
    if (unSuccessfulParagraph) {
      throw new Error('Not enough money')
    } 
  } catch(err) {
    throw err
  }
  console.log('Enough money')
  try {
    await page.waitForXPath("//span[contains(., 'Successful withdrawal')]")
    const [successfulSpan] = await page.$x("//span[contains(., 'Successful withdrawal')]");
    if (successfulSpan) {
      console.log('Successfully sent ' + amountToSend + ' to '  + cardNumber)
    } else{

      throw new Error()
    }
  } catch {throw new Error('unknown error while sending money')}
  
  

  await browser.close();
  // if (process.env.NODE_ENV == 'production') xvfb.stopSync()

}

