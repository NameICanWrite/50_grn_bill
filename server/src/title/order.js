import mongoose from "mongoose";
import dotenv from 'dotenv'





//order in usd
const orderSchema = mongoose.Schema({
  uid: String,
  payment: {
      status: String,
      amount: Number,
  },
  spinsCount: Number,
  description: String
})

const Order = mongoose.model("Order", orderSchema)

export default Order