import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import dotenv from 'dotenv'
import User from '../../user/user.js'



export const addJwtCookie = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN
  })

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 3600 * 1000),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
    cookieOptions.sameSite = 'none'
  }

  res.cookie('jwt', token, cookieOptions);
  return token
}


export async function decodeAuthToken(req, res, next) {
  let token = req.cookies.jwt
  // if(!token){
  //   return res.status(400).send('No auth token found')
  // }
  if (token) req.auth = await promisify(jwt.verify)(token, process.env.JWT_SECRET).catch();
  next()
}


export async function getUserByDecodedId(req, res, next) {
  req.user = await User.findById(req.auth?.uid)
  next()
}