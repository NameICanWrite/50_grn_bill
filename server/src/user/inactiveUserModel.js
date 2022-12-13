import mongoose from "mongoose";
import validator from "validator";
import dotenv from 'dotenv'




const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: [true, "This email already exists"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  name: String,
  password: {
    type: String,
    minlength: 5,
  },
	activationCode: String,
	activationCodeExpiresIn: Date,
	emailResendIn: Date
});


userSchema.post('save', function(error, doc, next) {
  if ((error.name === 'MongoError' || error.name === 'MongoServerError') && error.code === 11000) {
    next(new Error('Email must be unique'));
  } else {
    next(error);
  }

});

const InactiveUser = mongoose.model("InactiveUser", userSchema);

export default InactiveUser;