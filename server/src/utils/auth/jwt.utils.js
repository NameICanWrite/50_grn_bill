import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import dotenv from 'dotenv'
import User from '../../user/user.js'

const jwtCookieOptions = {
  httpOnly: true,
}
if (process.env.NODE_ENV === 'production') {
  jwtCookieOptions.secure = true
  jwtCookieOptions.sameSite = 'none'
  jwtCookieOptions.domain = process.env.ROOT_DOMAIN
  jwtCookieOptions.path = '/'
}


export const addJwtCookie = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN
  })

  const expires = new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 3600 * 1000)
  res.cookie('jwt', token, {...jwtCookieOptions, expires});
  console.log('added cookie');
  console.log({...jwtCookieOptions, expires});
  console.log('token', token);
  return token
}


export const removeJwtCookie = (req, res) => {

  res.clearCookie('jwt', jwtCookieOptions)
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