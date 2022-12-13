import mongoose from "mongoose";
import dotenv from 'dotenv'





//rewardRequest in usd
const rewardRequestSchema = mongoose.Schema({
  uid: String,
  name: String,
  date: String,
  email: String
})

const RewardRequest = mongoose.model("RewardRequest", rewardRequestSchema)

export default RewardRequest