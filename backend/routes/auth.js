const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// ✅ Setup Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS  // your App Password
  }
});

// ✅ REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: 'Please enter all fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      msg: "Registration successful"
    });

  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).send('Server error');
  }
});

// ✅ LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: 'Please enter all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      msg: "Login successful"
    });

  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send('Server error');
  }
});

// ✅ GET CURRENT USER
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send('Server error');
  }
});

// ✅ FORGOT PASSWORD → Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // expires in 5 min
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ msg: "OTP sent successfully to your email" });
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    res.status(500).json({ msg: "Server error sending OTP" });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "User not found" });

    if (!user.otp || user.otpExpire < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    if (user.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    // OTP valid
    res.json({ msg: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err.message);
    res.status(500).json({ msg: "Server error verifying OTP" });
  }
});

// ✅ RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User not found" });

    if (!user.otp || user.otpExpire < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    if (user.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear OTP fields
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    res.status(500).json({ msg: "Server error resetting password" });
  }
});

module.exports = router;
