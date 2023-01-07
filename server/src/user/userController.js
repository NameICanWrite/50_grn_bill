import AWS from 'aws-sdk'

import User from "./user.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import InactiveUser from './inactiveUserModel.js'
import { deleteFileFromGoogleDrive, uploadFileToGoogleDrive } from '../utils/file-upload/googleDrive.utils.js'
import { isNameInFreelancehuntProject } from '../utils/reward/freelancehunt.utils.js'
import Settings from '../settings/settings.js'

// export const getCurrentUser = async (req, res, next) => {
//     const user = await User.findById(req.auth?.uid);

//     //additional logic to check beyond schedule if user name is in freelancehunt project 
//     if (!user.didReceiveReward) {
//         const bool = await isNameInFreelancehuntProject(user.name)
//         if (bool) {
//             user.isNameInFreelancehuntProject = true
//             await user.save()
//         } else if (user.isNameInFreelancehuntProject) {
//             user.isNameInFreelancehuntProject = false
//             await user.save()
//         }
//     }

//     user.password = undefined
//     res.send(user)
// };

export const getCurrentUserAndContinue = async (req, res, next) => {
    req.user = await User.findById(req.auth?.uid);
    next()
};


export const getUser = async (req, res, next) => {
    const uid = req.params.uid
    
    let user
    let shouldBeActivated = false
    if (uid === 'current') {
        if (!(req.auth?.uid || req.auth?.inactiveUid)) return res.status(400).send('Login required')
        if (req.auth?.uid) {
            user = await User.findById(req.auth?.uid) 
        } else if (req.auth?.inactiveUid) {
            user = await InactiveUser.findById(req.auth?.inactiveUid)
            shouldBeActivated = true
        }
    } else {
        user = await User.findById(req.params.uid); 
    }
    if (!user) return res.status(400).send('No user found with this id')


    if (!(req.auth?.isAdmin || user._id.toString() == req.auth?.uid || user._id.toString() == req.auth?.inactiveUid)) user.email = undefined
    user.password = undefined

    let isWhitelisted,didReceiveReward
    if (uid == 'current' || req.auth?.isAdmin) {
        const settings = await Settings.findOne()
        isWhitelisted = settings.whitelistedUsers.some(item => (item == user.name) || (item == user.email))
        didReceiveReward = settings.receivedRewardUsers.some(item => (item.name && (item.name == user.name)) || (item.email && (item.email == user.email)) || (item.uid && (item.uid == user._id)))

    }


    return res.send({...user._doc, isWhitelisted, didReceiveReward, shouldBeActivated})

};

export const modifyCurrentUserCart = async (req, res, next) => {
    const cart = req.body
    const user = await User.findByIdAndUpdate(req.auth.uid, {cart})
    res.send('user cart set successfully')
}

export async function getAllUsers(req, res) {
    let users = await User.find({});
    users = users.map(user => {
        if (!(req.auth?.isAdmin || user._id == req.auth?.uid)) user.email = undefined
        user.password = undefined

        return user
    })
    res.send(users)
};

export const getCurrentInactiveUser = async (req, res) => {
        const inactiveUser = await InactiveUser.findById(req.auth.inactiveUid);
        inactiveUser.password = undefined
        res.send(inactiveUser)
}

export const getAllInactiveUsers = async (req, res) => {
        let inactiveUsers = await InactiveUser.find({});
        inactiveUsers = inactiveUsers.map(inactiveUser => {
          inactiveUser.password = undefined
          return inactiveUser
        })
        res.send(inactiveUsers)
}

export const setAvatar = async (req, res) => {
    const avatar = req.files.avatar
    console.log(avatar);
    const fileName = `${Date.now()}${avatar.name}`

    
    const fileId = (await uploadFileToGoogleDrive({ ...avatar, name: fileName })).id

    if (req.user.avatar) {
        await deleteFileFromGoogleDrive(req.user.avatar)
    }
    
    req.user.avatar = fileId
    req.user.didAddAvatar = true
    await req.user.save()
    console.log('added avatar')

    res.send('new awatar has been set')
}



