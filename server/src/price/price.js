import mongoose from "mongoose";
import dotenv from 'dotenv'





//price in usd
const priceSchema = mongoose.Schema({
 spinPrice: {
  type: Number,
  default: 2.5
 }
})

const Price = mongoose.model("Price", priceSchema)

export default Price