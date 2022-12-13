import express from 'express'
import { isAdmin, isLoggedIn } from '../auth/authController.js'
import { getCurrentUserAndContinue } from '../user/userController.js'
import { decodeAuthToken } from '../utils/auth/jwt.utils.js'
import { askForReward, getRewardRequests, recognizeUserByAdmin, requestAdminEligibilityRecognition } from './rewardController.js'

const rewardRouter = express.Router()

rewardRouter
  .post('/', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, askForReward)
  .get('/request-recognition', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, requestAdminEligibilityRecognition)
  .post('/recognize-user', decodeAuthToken, isAdmin, recognizeUserByAdmin)
  .get('/reward-requests', decodeAuthToken, isAdmin, getRewardRequests)

  
export default rewardRouter
