import User from "../user/user.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import isEmail from 'isemail'
import dotenv from 'dotenv'
import crypto from "crypto"
import {
  addJwtCookie
} from '../utils/auth/jwt.utils.js'
import { generateSixDigitCode, sendEmailActivationCode, sendEmailConfirmation, sendEmailRecovery } from "../utils/email/email.utils.js"
import InactiveUser from "../user/inactiveUserModel.js"
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'









export async function setUserPassword(req, res) {
  const id = req.auth.uid
  const {password} = req.body
  const hashedPassword = await bcrypt.hash(password, 12)

  await User.findByIdAndUpdate(id, {password: hashedPassword})

  return res.status(200).send("New Password set successfully")
}


export async function createInactiveUser(req, res) {
  const {email, name, password} = req.body

  if (await User.exists({email})) return res.status(400).send('User with such email already exists')

  const hashedPassword = await bcrypt.hash(password, 12)
  let inactiveUser = await User.findOne({ email })

  if (!inactiveUser) inactiveUser = new InactiveUser({ email }) 

  inactiveUser.name = name
  inactiveUser.password = hashedPassword
  

  await inactiveUser.save()

  addJwtCookie(res, {inactiveUid: inactiveUser._id})
  res.status(200).send('Inactive user created')
}

export async function sendActivationCode(req, res) {
  const id = req.auth.inactiveUid

  const activationCode = generateSixDigitCode()
  const hashedActivationCode = await bcrypt.hash(activationCode, 12)

  const inactiveUser = await InactiveUser.findById(id)
  if (!inactiveUser) return res.status(400).send(`Cant find this registration. Try to sign up again`)

  inactiveUser.activationCode = hashedActivationCode
  inactiveUser.activationCodeExpiresIn = Date.now() + 60 * 60 * 1000

  if (
        !inactiveUser.emailResendIn 
      || 
        (new Date(inactiveUser.emailResendIn).getTime() < Date.now())
    ) {
    await sendEmailActivationCode(inactiveUser.email, activationCode)
    inactiveUser.emailResendIn = Date.now() + 2 * 60 * 1000
  } else {
    return res.status(400).send(`Before sending email again wait for ${Math.floor((new Date(inactiveUser.emailResendIn).getTime() - Date.now()) / 1000)} seconds`)
  }

  await inactiveUser.save()
  return res.status(200).send(`The activation code has been sent`)
}

export async function activateUserWithCode(req, res) {
  const id = req.auth.inactiveUid
  const code = req.body.code

  const inactiveUser = await InactiveUser.findById(id)

  const isMatch = await bcrypt.compare(code, inactiveUser.activationCode)
  const isValid = new Date(inactiveUser.activationCodeExpiresIn).getTime() > Date.now()

  if (!(isValid && isMatch)) return res.status(400).send(`The code is invalid or has expired`)

  const {name, password, email } = inactiveUser
  const isAdmin = email === process.env.ADMIN_EMAIL
  const user = new User({name, password, email, isAdmin})
  await user.save()

  await inactiveUser.delete()

  
  res.clearCookie('jwt')
  addJwtCookie(res, {uid: user._id, isAdmin})

  res.status(200).send(`User activated successfully${isAdmin ? '. Logged in as Admin' : ''}`)
}




export async function sendAccountRecoveryWithEmail(req, res) {
    let { email } = req.body;
    //validate email
    if (!isEmail.validate(email)) return res.status(400).send("Invalid email")

    //check if user exists
    let user = await User.findOne({ email })
    if (!user) return res.status(400).send('No user with such email')

    //create new reset token to generate link
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex').toString()
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    
    await user.save()
    await sendEmailRecovery(email, resetToken)
    return res.status(200).send("Email recovery sent")
}

export async function recoverAccountWithLink(req, res) {
  let token = req.query.token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
    .toString()

  const user = await User.findOne({passwordResetToken: hashedToken})

  if (!user) return res.status(400).send("User not found")
  if (new Date(user.passwordResetExpires).getTime() <= Date.now()) return res.status(400).send("Password reset has expired. Try again")

  const isAdmin = (user.email === process.env.ADMIN_EMAIL)
  addJwtCookie(res, {uid: user._id, isAdmin})

  res.status(200).send(`Account recovered successfully${isAdmin ? '. Logged in as Admin' : ''}`)
}



export const loginWithEmailOrNameAndPassword = async (req, res) => {
  let { emailOrName, password } = req.body;
  let user

  if (!emailOrName) {
    return res.status(400).send('Email or name is required')
  }



  //find user
  if (isEmail.validate(emailOrName)) {
    user = await User.findOne({email: emailOrName})
  } else {
    user = await User.findOne({name: emailOrName})
  }
 
  if (!user) {
    return res.status(400).send('User doesn\'t exist');
  }

  //check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send('Password incorrect');
  }

  const admins = await User.find({isAdmin: true})

  const isAdmin = (emailOrName === process.env.ADMIN_EMAIL) || admins?.some(admin => admin.name === emailOrName)
  addJwtCookie(res, { uid: user._id, isAdmin })
  res.status(200).send(`Logged in successfully${isAdmin ? ' as Admin' : ''}`)
};



export const loginWithGoogle = async (req, res) => {
  const { name, email, picture } = req.credentials
  const isAdmin = email === process.env.ADMIN_EMAIL
  const generatedName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals], // colors can be omitted here as not used
    separator: '-',
    length: 2
  })
  console.log(generatedName)
  console.log(isAdmin)

  
  const user = await User.findOneAndUpdate({ email }, { $setOnInsert: { email } }, { upsert: true, new: true }) //find or create
  user.isAdmin = isAdmin
  if (!user.name) user.name = generatedName
  await user.save()

  if (!user) return res.status(500).send('Unable to log in with Google')

  addJwtCookie(res, { uid: user._id, isAdmin })
  return res.status(200).send(`Logged in successfully${isAdmin ? ' as Admin' : ''}`)
}

export const isAdmin = async (req, res, next) => {
  if (req.auth?.isAdmin) return next()
  else if (process.env.ADMIN_AUTH_IS_OFF) return next()
  else return res.status(400).send('You are not admin!')
}

export const isLoggedIn = async (req, res, next) => {
  if (req.auth?.uid) return next()
  else return res.status(400).send('You should login first')
}

export async function setUserName(req, res) {
   const {name} = req.body
   await User.findByIdAndUpdate(req.auth.uid, {name})
   return res.send("User name set successfully")
}

export async function setUserEmail(req, res, next) {
  const {email} = req.body
  await User.findByIdAndUpdate(req.auth.uid, {email})
  return res.send("User email set successfully")
}

export const logout = (req, res) => {
  res.clearCookie('jwt')
  res.status(200).send('Log out successful');
};

export const isNewUsernameValid = async (req, res, next) => {
  const name = req.body.name.toLowerCase()
  if (!name) res.status(400).send('Name is required')
  if (name.length < 3) res.status(400).send('The name should be 3 symbols or longer')

  const uid = req.auth?.uid
  const users = await User.find({})

  
  if (uid) {
    const oldName = users.find(user => user._id == uid).name
    if (name == oldName) return res.status(400).send('Its your name already!')
  }

  if (users.some(user => user.name == name)) res.status(400).send('The name is already registered. Choose a unique name')

  next()
}



export const isNewEmailValid = async (req, res, next) => {
  const {email } = req.body
  if (!isEmail.validate(email)) return res.status(400).send('It`s not a email...')

  const uid = req.auth?.uid
  const users = await User.find({})
  

  if (uid) {
    const oldEmail = users.find(user => user._id == uid).email
    if (email == oldEmail) next()
  }

  if (users.some(user => user.email == email)) res.status(400).send('The email is already registered. Choose a unique email')

  next()
}



export const isNewUsernameAndEmailValid = async (req, res, next) => {
  const {name, email} = req.body
  if (!name) return res.status(400).send('Name is required')
  if (name.length < 3) return res.status(400).send('The name should be 3 symbols or longer')
  if (!isEmail.validate(email)) return res.status(400).send('It`s not a email...')

  const uid = req.auth?.uid
  const users = await User.find({})

  if (uid) {

    const oldName = users.find(user => user._id == uid).name
    const oldEmail = users.find(user => user._id == uid).email

    if (name != oldName) 
      if (users.some(user => user.name == name)) res.status(400).send('The name is already registered. Choose a unique name')
    
    if (email != oldEmail)
      if (users.some(user => user.email == email)) res.status(400).send('The email is already registered. Choose a unique email')

    next()
  } else {
    if (users.some(user => user.name == name)) res.status(400).send('The name is already registered. Choose a unique name')
    if (users.some(user => user.email == email)) res.status(400).send('The email is already registered. Choose a unique email')

    next()
  }
  
}

export const sendOK = (req, res) => {res.send('OK')}






///unused
///unused
///unused
export const signUpWithEmail = async (req, res) => {
  let { email } = req.body;
  //validate email
  if (!isEmail.validate(email)) return res.status(400).send("Invalid email")

  //check if user exists
  let user = await User.findOne({ email })
  if (user) return res.status(400).send('Email is already registered')

  await sendEmailConfirmation(email)
  return res.status(200).send("Email confirmation sent")
};

export async function verifyEmailAndCreateAccount(req, res) {
  let token = req.query.token
  const { email } = jwt.verify(token, process.env.JWT_SECRET)
  if (!isEmail.validate(email)) return res.status(400).send("Error verifying email")

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("Cant verify. This email has already been verified in the past")

  user = await User.create({ email })

  addJwtCookie(res, { uid: user._id })

  return res.send(`Email verified. User account created`);
};
