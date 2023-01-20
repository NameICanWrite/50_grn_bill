import puppeteer from 'puppeteer-extra';
import {executablePath} from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import dotenv from 'dotenv'
import { uploadFileToGoogleDrive } from '../file-upload/googleDrive.utils.js';
import fs from 'fs'

dotenv.config()



export async function sendMoneyGeopay({cardNumber = process.env.MY_CARD_NUMBER, amountToSend = '50'}) {

  amountToSend.toString()

  puppeteer.use(StealthPlugin())

  const vpn = {
    host: '185.199.229.156:7492',
    user: 'gltgjeaz',
    pass: '96gnf0afb0us'
  }
  const browser = await puppeteer.launch({ headless: true, executablePath: executablePath(), 
    // currentUserDir: "./puppeteer_user_data" 
    args: [
      '--disable-dev-shm-usage',
      '--proxy-server='+vpn.host
  ]
  });
  const page = await browser.newPage();
  await page.authenticate({
    username: vpn.user,
    password: vpn.pass,
  });
  
 
  //login to Geopay using headless browser
  try {

    await page.goto('https://geo-pay.net/auth/log-in', { waitUntil: 'networkidle0' });
    


    //screenshot
    const name = 'postImage' + Date.now() + (Math.floor(Math.random() * 1000)).toString() + '.png'
    const path = 'temp/' + name
    await page.screenshot({
      path
    })
    const file = {
      path,
      name,
      mimetype: 'image/png'
    }
    const screenshotFileId = (await uploadFileToGoogleDrive(file)).id
		fs.unlinkSync(file.path)
    console.log('geopay screenshot id: ' + screenshotFileId)
    
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
  await page.goto('https://geo-pay.net/dashboard', { waitUntil: 'networkidle0' });
  await page.goto('https://geo-pay.net/dashboard/withdrawal', { waitUntil: 'networkidle0' });
  await page.type('input[name=amount]', amountToSend)
  await page.type('input[name=cardNumber]', cardNumber)
  throw Error('bug fixed')
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
    } 
  } catch {throw new Error('unknown error while sending money')}
  
  

  await browser.close();

}

