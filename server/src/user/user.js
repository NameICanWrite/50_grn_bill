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
  isAdmin: {
    type: Boolean,
    default: false
  },
  spins: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    lowercase: true,
    unique: [true, "This email already exists"],
  },
  password: {
    type: String,
    minlength: 5,
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  avatar: String,
  title: {
    default: 'Newbie',
    type: String
  },
  didReceiveTitle: {
    type: Boolean,
    default: false
  },
  didAddPost: {
    type: Boolean,
    default: false
  },
  didLikePost: {
    type: Boolean,
    default: false
  },
  didAddAvatar: {
    type: Boolean,
    default: false
  },
  isNameInFreelancehuntProject: {
    type: Boolean,
    default: false
  },
  didAdminRecognized: {
    type: Boolean,
    default: false
  },
  didRequestAdminRecognition: {
    type: Boolean,
    default: false
  },
  isReceivingRewardNow: {
    type: Boolean,
    default: false
  },
  didReceiveReward: {
    type: Boolean,
    default: false
  },
});

// userSchema.pre('save', async function(next) {
//   // Only run this function if password was actually modified
//
//
//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);
//
//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

userSchema.post('save', function(error, doc, next) {
  if ((error.name === 'MongoError' || error.name === 'MongoServerError') && error.code === 11000) {
    next(new Error('Email must be unique'));
  } else {
    next(error);
  }
  
}); 

const User = mongoose.model("User", userSchema);

export default User;