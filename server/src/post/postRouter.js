import express from "express"
import { isAdmin, isLoggedIn } from "../auth/authController.js";
import { addPost, addPostImages, deleteAllPosts, deletePost, editPost, getAllPosts, getPost, getPostByIdAndConfirmOwner, likePost, removeLike, removePostImages } from "./postController.js";
import { getCurrentUserAndContinue } from "../user/userController.js";
import { decodeAuthToken } from "../utils/auth/jwt.utils.js";

const router = express.Router();



router
  .get('/one/:postId', decodeAuthToken, getPost)

  .get('/one/:postId/like', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, likePost)
  .get('/one/:postId/remove-like', decodeAuthToken, isLoggedIn, removeLike)

  .post('/one/:postId', decodeAuthToken, isLoggedIn, getPostByIdAndConfirmOwner, editPost)
  .delete('/one/:postId', decodeAuthToken, isLoggedIn, getPostByIdAndConfirmOwner, deletePost)

  .post('/one/:postId/add-images', decodeAuthToken, isLoggedIn, getPostByIdAndConfirmOwner, addPostImages)
  .post('/one/:postId/remove-images', decodeAuthToken, isLoggedIn, getPostByIdAndConfirmOwner, removePostImages)
  .delete('/all', decodeAuthToken, isAdmin, deleteAllPosts)

  

router.get('/all', decodeAuthToken, getAllPosts)
router.post('/', decodeAuthToken, isLoggedIn, getCurrentUserAndContinue, addPost)

export default router