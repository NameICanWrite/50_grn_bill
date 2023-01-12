import express from 'express'
import { isAdmin } from '../auth/authController.js'
import { decodeAuthToken } from '../utils/auth/jwt.utils.js'
import Settings from './settings.js'

const settingsRouter = express.Router()

settingsRouter
  .post('/set-spin-price', decodeAuthToken, isAdmin, async (req, res) => {
    const newSettings = req.body

    let settings = (await Settings.findOne()) || (await Settings.create({}))

    settings.spinPrice = newSettings.spinPrice
    
    await settings.save()

    res.send(settings)
  })

  settingsRouter.get('/', decodeAuthToken, isAdmin, async (req, res) => {
    const projectSettings = await Settings.findOne()
    return res.send(projectSettings)
  })

  settingsRouter
  .post('/add-whitelisted-users', decodeAuthToken, isAdmin, async (req, res) => {
    const newWhitelistedUsers = req.body

    let settings = (await Settings.findOne()) || (await Settings.create({}))

    newWhitelistedUsers.forEach(userNameOrEmail => {
      if (!settings.whitelistedUsers.includes(userNameOrEmail)) {
      settings.whitelistedUsers.push(userNameOrEmail)
      }
      settings.receivedRewardUsers.filter(user => !((user.name == userNameOrEmail) || (user.email == userNameOrEmail)))
    })
    await settings.save()

    res.send(settings)
  })
  .post('/remove-whitelisted-users', decodeAuthToken, isAdmin, async (req, res) => {
    const unlistedUsers = req.body


    let settings = (await Settings.findOne()) || (await Settings.create({}))
    settings.whitelistedUsers = settings.whitelistedUsers.filter(usernameOrEmail => unlistedUsers.includes(usernameOrEmail))

    await settings.save()

    res.send(settings)
  })
  
export default settingsRouter
