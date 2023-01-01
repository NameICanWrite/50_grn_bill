import Settings from "../settings/settings.js"
import User from "../user/user.js"
import { sendEmailRecognizedByAdmin } from "../utils/email/email.utils.js"
import { getAllNamesInFreelancehuntProject, isNameInFreelancehuntProject as isNameInFreelancehuntProjectFunction } from "../utils/reward/freelancehunt.utils.js"
import { sendMoneyGeopay } from "../utils/reward/sendMoneyGeopay.js"
import RewardRequest from "./rewardRequest.js"



export async function askForReward(req, res, next) {
  const user = req.user

  if (user.isReceivingRewardNow) {
    return res.status(400).send('Wait a little. You reward is already being sent')
  }

  const cardNumber = req.body.cardNumber
  const settings = await Settings.findOne()
  const {whitelistedUsers, receivedRewardUsers} = settings

  if (receivedRewardUsers.some(item => (item.name == user.name) || (item.email == user.email) || (item.uid == user._id))) return res.status(400).send('It seems you have already received reward')

   //check beyond schedule if user name is in freelancehunt project 
    if (!whitelistedUsers.some(item => (item == user.name) || (item == user.email))) {
      const isNameInFreelancehuntProject = await isNameInFreelancehuntProjectFunction(user.name)
      if (isNameInFreelancehuntProject) whitelistedUsers.push(user.name)
    }
    
  const isWhitelisted = whitelistedUsers.some(item => (item == user.name) || (item == user.email))
  const {
    didReceiveTitle,
    didAddPost,
    didLikePost,
    didAddAvatar,
  } = user

  const isEligible = (
    didAddAvatar 
    && 
    didAddPost 
    && 
    didReceiveTitle 
    && 
    didLikePost 
    && 
    isWhitelisted
    )

  if (!isEligible) {
    await user.save()
    return res.status(400).send('You are not eligible')
  }

  user.isReceivingRewardNow = true
  await user.save()

  try {
    await sendMoneyGeopay({cardNumber, amountToSend: '50'})
  } catch(err) {
    user.isReceivingRewardNow = false
    await user.save()
    return res.status(400).send(err.message)
  }
  
  user.isReceivingRewardNow = false
  
  settings.receivedRewardUsers.push({name: user.name, email: user.email, uid: user._id})
  
  await settings.save()
  await user.save()

  return res.send('Reward has been sent. Wait a little bit')
}



export async function requestAdminEligibilityRecognition(req, res, next) {
  const user = req.user

  if (user.didRequestAdminRecognition) return res.status(400).send('You have already asked admin to recognize you')
  

  await RewardRequest.create({
    uid: req.user._id,
    date: new Date().toISOString(),
    name: user.name,
    email: user.email
  })

  user.didRequestAdminRecognition = true
  await user.save()

  return res.send('You have requested admin to recognize you')
}



// export async function recognizeUserByAdmin(req, res, next) {
//   const uid = req.body.uid
//   const user = await User.findByIdAndUpdate(uid, {didAdminRecognized: true})
//   await RewardRequest.findOneAndDelete({uid})

//   await sendEmailRecognizedByAdmin(user.email)
//   return res.send('recognized user successfully')
// }

export async function getRewardRequests(req, res, next) {
const requests = await RewardRequest.find({})
 return res.send(requests)
}


export async function checkAllUsersNamesForBeingFreelanceInProject() {
  const users = await User.find({})
  const settings = await Settings.findOne()
  const allNamesInFreelancehuntProject = await getAllNamesInFreelancehuntProject()

  for (let i in users) {
    const user = users[i]

    //if user didnt receive reward and not in whitelist add to whitelist
    if (
        (
            !settings.whitelistedUsers.some(item => item == user.name || item == user.email) 
          || 
            !settings.receivedRewardUsers.some(item => (item.name && (item.name == user.name)) || (item.email && (item.email == user.email)) || (item.uid && (item.uid == user._id.toString())))
        ) 
      && 
        allNamesInFreelancehuntProject.includes(user.name)
      ) {
      settings.whitelistedUsers.push(user.name)
    }
  }

  console.log('checked all users names for being freelance in project')
  console.log(curr);
}

