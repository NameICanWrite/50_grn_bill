import mongoose from "mongoose";
import dotenv from 'dotenv'





//price in usd
const postSchema = mongoose.Schema({
  header: String,
  text: String,
  images: [String],
  date: String,
  author: String, 
  likedBy: [String]
})

const Post = mongoose.model("Post", postSchema)

export default Post
