import puppeteer from 'puppeteer-extra';
import {executablePath} from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import dotenv from 'dotenv'

export default async function makeUrlScreenshot(url) {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({ headless: false, executablePath: executablePath()})
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
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

  await browser.close()

  return file
}

