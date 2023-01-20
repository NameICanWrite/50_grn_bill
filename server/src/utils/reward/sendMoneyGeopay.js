import puppeteer from 'puppeteer-extra';
import {executablePath} from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import dotenv from 'dotenv'

dotenv.config()



export async function sendMoneyGeopay({cardNumber = process.env.MY_CARD_NUMBER, amountToSend = '50'}) {

  amountToSend.toString()

  puppeteer.use(StealthPlugin())


  const browser = await puppeteer.launch({ headless: true, executablePath: executablePath(), 
    // currentUserDir: "./puppeteer_user_data" 
  });
  const page = await browser.newPage();

  
 
  //login to Geopay using headless browser
  try {
    await page.goto('https://geo-pay.net/auth/log-in', { waitUntil: 'networkidle0' });
    
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

