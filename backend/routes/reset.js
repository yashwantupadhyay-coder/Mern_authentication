const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");
const crypto = require("crypto");

// 📍 1. Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is:</h2><h1>${otp}</h1><p>It expires in 5 minutes.</p>`
    });

    res.json({ msg: "OTP sent to email" });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// 📍 2. Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.otpExpire < Date.now()) return res.status(400).json({ msg: "OTP expired" });

    res.json({ msg: "OTP verified" });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// 📍 3. Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.otpExpire < Date.now()) return res.status(400).json({ msg: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
