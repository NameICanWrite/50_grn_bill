import puppeteer from 'puppeteer-extra';
import {executablePath} from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fs from 'fs/promises'




const amountToWithdraw = '50'
const cardNumber = '5375411414987953'

puppeteer.use(StealthPlugin())


  const browser = await puppeteer.launch({ headless: true, executablePath: executablePath(), currentUserDir: "./puppeteer_user_data" });
  const page = await browser.newPage();

  

  //login
  await page.goto('https://geo-pay.net/dashboard', { waitUntil: 'networkidle0' });
  try {
    
    console.log('Logging in...')
    await page.type('input[type=tel]', '992856055')
    await page.type('input[type=password]', 'h%UKfMkKzRIs1')
    await page.click('button[type=submit]')

  } catch {
    console.log('It seems you have logged in before')
  }

  let holdProgress = true;
  while (holdProgress) {
      await (new Promise(res => setTimeout(res, 300)))
      console.log(page.url())
      if (page.url().includes('/dashboard')) {
          holdProgress = false;
      }
  }

  console.log('Logged in')


  //withdraw assets
  await page.goto('https://geo-pay.net/dashboard', { waitUntil: 'networkidle0' });
  await page.goto('https://geo-pay.net/dashboard/withdrawal', { waitUntil: 'networkidle0' });
  await page.type('input[name=amount]', amountToWithdraw)
  await page.type('input[name=cardNumber]', cardNumber)
  await page.click('button[type=submit]')
  console.log('clicked to withdraw')
  await page.screenshot({
    path: Date.now() + '.jpg'
  })
  
  try {
    const [unSuccessfulParagraph] = await page.$x("//p[contains(., 'Enter the value within the range')]");
  if (unSuccessfulParagraph) {
    console.log('NOt enough')
  } 
  } catch {console.log('Enough money')}


  try {
    await page.waitForXPath("//span[contains(., 'Successful withdrawal')]")
    const [successfulSpan] = await page.$x("//span[contains(., 'Successful withdrawal')]");
  if (successfulSpan) {
    console.log('withdraw successful')
  } else {console.log('withdrawal unsuccessfull')}
} catch {console.log('wtf')}
  
  


  // // Wait for suggest overlay to appear and click "show all results".
  // const allResultsSelector = '.devsite-suggest-all-results';
  // await page.waitForSelector(allResultsSelector);
  // await page.click(allResultsSelector);

  // // Wait for the results page to load and display the results.
  // const resultsSelector = '.gsc-results .gs-title';
  // await page.waitForSelector(resultsSelector);

  // // Extract the results from the page.
  // const links = await page.evaluate(resultsSelector => {
  //   return [...document.querySelectorAll(resultsSelector)].map(anchor => {
  //     const title = anchor.textContent.split('|')[0].trim();
  //     return `${title} - ${anchor.href}`;
  //   });
  // }, resultsSelector);

  // // Print all the files.
  // console.log(links.join('\n'));

  await browser.close();




// // puppeteer usage as normal
// puppeteer.launch({ headless: true, executablePath: executablePath() }).then(async browser => {
//   console.log('Running tests..')
//   const page = await browser.newPage()
//   await page.goto('https://bot.sannysoft.com')
//   await page.waitForTimeout(5000)
//   await page.screenshot({ path: 'testresult.png', fullPage: true })
//   await browser.close()
//   console.log(`All done, check the screenshot. ✨`)
// })