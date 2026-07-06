require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (for frontend)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// ✅ Connect Database
connectDB(process.env.MONGO_URI);

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));          // Login & Register
app.use('/api/auth', require('./routes/reset'));         // OTP / Forgot / Reset Password

// ✅ Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
