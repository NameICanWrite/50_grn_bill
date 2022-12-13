import User from "../user/user.js"
import { sendEmailRecognizedByAdmin } from "../utils/email/email.utils.js"
import { getAllNamesInFreelancehuntProject, isNameInFreelancehuntProject as isNameInFreelancehuntProjectFunction } from "../utils/reward/freelancehunt.utils.js"
import { sendMoneyGeopay } from "../utils/reward/sendMoneyGeopay.js"
import RewardRequest from "./rewardRequest.js"



export async function askForReward(req, res, next) {
  const user = req.user
  const cardNumber = req.body.cardNumber

   //check beyond schedule if user name is in freelancehunt project 
   if (!user.didReceiveReward) {
    const bool = await isNameInFreelancehuntProjectFunction(user.name)
    if (bool) {
        user.isNameInFreelancehuntProject = true
    } else if (user.isNameInFreelancehuntProject) {
        user.isNameInFreelancehuntProject = false
    }
  }

  const {
    didReceiveTitle,
    didAddPost,
    didLikePost,
    didAddAvatar,
    isNameInFreelancehuntProject,
    didAdminRecognized,
    isReceivingRewardNow,
    didReceiveReward
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
    (isNameInFreelancehuntProject || didAdminRecognized) 
    && 
    !didReceiveReward
    )

  if (!isEligible) {
    await user.save()
    return res.status(400).send('You are not eligible')
  }
  if (isReceivingRewardNow) {
    return res.status(400).send('Wait a little. You reward is already being sent')
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
  user.didReceiveReward = true
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



export async function recognizeUserByAdmin(req, res, next) {
  const uid = req.body.uid
  const user = await User.findByIdAndUpdate(uid, {didAdminRecognized: true})
  await RewardRequest.findOneAndDelete({uid})

  await sendEmailRecognizedByAdmin(user.email)
  return res.send('recognized user successfully')
}

export async function getRewardRequests(req, res, next) {
const requests = await RewardRequest.find({})
 return res.send(requests)
}


export async function checkAllUsersNamesForBeingFreelanceInProject() {
  const users = await User.find({})
  const allNamesInFreelancehuntProject = await getAllNamesInFreelancehuntProject()

  for (let i in users) {
    const user = users[i]

    if (!user.didReceiveReward) {
      user.isNameInFreelancehuntProject = allNamesInFreelancehuntProject.includes(user.name)
      await user.save()
    }
  }

  console.log('checked all users names for being freelance in project')
}

