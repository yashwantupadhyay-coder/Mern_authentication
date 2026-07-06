const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  // OTP for verification / forgot password
  otp: {
    type: String,
    default: null
  },

  otpExpire: {
    type: Date,
    default: null
  }
});

// ✅ Method to clear OTP after successful verification
UserSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpire = null;
};

module.exports = mongoose.model("User", UserSchema);
