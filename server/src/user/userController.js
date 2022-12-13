import AWS from 'aws-sdk'

import User from "./user.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import InactiveUser from './inactiveUserModel.js'
import { uploadFileToGoogleDrive } from '../utils/file-upload/googleDrive.utils.js'
import { isNameInFreelancehuntProject } from '../utils/reward/freelancehunt.utils.js'

export const getCurrentUser = async (req, res, next) => {
    const user = await User.findById(req.auth?.uid);

    //additional logic to check beyond schedule if user name is in freelancehunt project 
    if (!user.didReceiveReward) {
        const bool = await isNameInFreelancehuntProject(user.name)
        if (bool) {
            user.isNameInFreelancehuntProject = true
            await user.save()
        } else if (user.isNameInFreelancehuntProject) {
            user.isNameInFreelancehuntProject = false
            await user.save()
        }
    }

    user.password = undefined
    res.send(user)
};

export const getCurrentUserAndContinue = async (req, res, next) => {
    req.user = await User.findById(req.auth?.uid);
    next()
};

export const getUser = async (req, res, next) => {
    const uid = req.params.uid
    let user

    if (uid === 'current') {
        user = await User.findById(req.auth?.uid);
    } else {
        user = await User.findById(req.params.uid); 
    }

    if (!(req.auth?.isAdmin || uid == req.auth?.uid)) delete user.email
    user.password = undefined
    return res.send(user)

};

export const updateUserCart = async (req, res, next) => {
    const cart = req.body
    const user = await User.findByIdAndUpdate(req.auth.uid, {cart})
    res.send('user cart set successfully')
}

export async function getAllUsers(req, res) {

    let users = await User.find({});
    users = users.map(user => {
        console.log(!(req.auth?.isAdmin || user._id == req.auth?.uid))
        if (!(req.auth?.isAdmin || user._id == req.auth?.uid)) user.email = undefined
        user.password = undefined
        console.log(user.password)
        console.log(user.email)

        return user
    })
    console.log(users)
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
    const fileName = `${Date.now()}${avatar.name}`

    
    const fileId = (await uploadFileToGoogleDrive({ ...avatar, name: fileName })).id

    req.user.avatar = fileId
    req.user.didAddAvatar = true
    await req.user.save()

    res.send('new awatar has been set')
}



