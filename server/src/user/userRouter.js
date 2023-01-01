import express from "express"
import { isAdmin, isLoggedIn } from "../auth/authController.js";
import { getAllInactiveUsers, getAllUsers, getCurrentInactiveUser,  getCurrentUserAndContinue, getUser, setAvatar, modifyCurrentUserCart } from "./userController.js";


import { decodeAuthToken} from "../utils/auth/jwt.utils.js";
import { verifyImageFiles } from "../utils/file-upload/upload.utils.js";

const router = express.Router();

router.use(decodeAuthToken)

router.route('/one/:uid')
    .get(decodeAuthToken, getUser)


router.get('/all', getAllUsers)


router.get('/inactive/all', isAdmin, getAllInactiveUsers)
router.get('/inactive', isAdmin, getCurrentInactiveUser)
router.post('/set-avatar', isLoggedIn, getCurrentUserAndContinue, verifyImageFiles, setAvatar)


export default router
