import mongoose from "mongoose";
import dotenv from 'dotenv'





//price in usd
const postSchema = mongoose.Schema({
  website: String,
  tags: [String],
  linkPreview: {
    title: String,
    siteName: String,
    description: String,
    imageUrl: String,
    screenshotFileId: String,
  },
  date: String,
  author: String, 
  likedBy: [String]
})

const Post = mongoose.model("Post", postSchema)

export default Post
