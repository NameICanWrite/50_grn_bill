import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import dotenv from 'dotenv'
import User from '../../user/user.js'



export const addJwtCookie = (res, payload) => {
  const cookieExpires = new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 3600 * 1000)

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN
  })

  const cookieOptions = {
    expires: cookieExpires,
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
    cookieOptions.sameSite = 'none'
  }

  res.cookie('jwt', token, cookieOptions);
  res.cookie('jwt-cookie-options', JSON.stringify(cookieOptions), cookieOptions)
  return token
}

export const removeJwtCookie = (req, res) => {
  const cookieOptions = JSON.parse(req.cookies['jwt-cookie-options'])

  if (process.env.NODE_ENV == 'production') {
    cookieOptions.domain = process.env.ROOT_DOMAIN
    cookieOptions.path = '/'
  }
  cookieOptions.expires = new Date(cookieOptions.expires)

  res.clearCookie('jwt', cookieOptions)
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