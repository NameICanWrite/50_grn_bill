import express from "express"
import { activateUserWithCode, createInactiveUser, isNewEmailValid, isNewUsernameAndEmailValid, isNewUsernameValid, loginWithEmailOrNameAndPassword, loginWithGoogle, logout, recoverAccountWithLink, sendAccountRecoveryWithEmail, sendActivationCode, sendOK, setUserEmail, setUserName, setUserPassword, signUpWithEmail, verifyEmailAndCreateAccount } from "./authController.js";
import { decodeAuthToken } from "../utils/auth/jwt.utils.js";
import { decodeGoogleCredentials } from "../utils/auth/oAuth.utils.js";

const router = express.Router();

//login
router.post('/login-with-google', decodeGoogleCredentials, loginWithGoogle)
router.post('/login', loginWithEmailOrNameAndPassword)

//signup with email
router.post('/create-inactive-user', isNewUsernameAndEmailValid, createInactiveUser)
router.post('/send-activation-code', decodeAuthToken, sendActivationCode)
router.post('/activate-user-with-code', decodeAuthToken, activateUserWithCode)

//recovery
.post('/send-recovery-link', sendAccountRecoveryWithEmail)
.get('/recover-account', recoverAccountWithLink)

//credentials
.post('/set-password', decodeAuthToken, setUserPassword)
.post('/set-name', decodeAuthToken, isNewUsernameValid, setUserName)
.post('/set-email', decodeAuthToken, isNewEmailValid, setUserEmail)

.post('/is-new-email-valid', isNewEmailValid, sendOK)
.post('/is-new-name-valid', isNewUsernameValid, sendOK)

router.post('/logout', logout)

//// create user after checking email
// router.post('/signup-with-email', signUpWithEmail)
// router.get('/verify-email-and-create-account', verifyEmailAndCreateAccount)

export default router