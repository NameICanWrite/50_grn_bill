import mongoose from "mongoose";
import dotenv from 'dotenv'





//settings of current project
const settingsSchema = mongoose.Schema({
 spinPrice: {
  type: Number,
  default: 2.5
 },
 whitelistedUsers: [String],
 receivedRewardUsers: [{
  name: String,
  email: String,
  uid: String
 }]
})

const Settings = mongoose.model("Settings", settingsSchema)

export default Settings