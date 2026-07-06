import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './components/VerifyOTP';
import ResetPassword from './components/ResetPassword';

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="font-extrabold text-2xl text-slate-800">
            MERN Auth
          </Link>
          <div className="space-x-3">
            <Link to="/register" className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
              Register
            </Link>
            <Link to="/login" className="px-4 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-700 transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <Routes>
            {/* 🏠 Home Page */}
            <Route
              path="/"
              element={
                <div className="text-center py-16">
                  <h1 className="text-5xl font-extrabold text-slate-800 mb-4">
                    Welcome to <span className="text-blue-600">MERN Auth</span>
                  </h1>
                  <p className="text-lg text-slate-600 mb-8">
                    A secure authentication system built using the MERN stack — with Login, Register, and OTP-based password recovery.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => navigate('/register')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-3 bg-white border border-slate-300 rounded-lg shadow-md hover:bg-slate-100 transition"
                    >
                      Already a User? Login
                    </button>
                  </div>

                  <div className="mt-12 flex justify-center">
                    <img
                      src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
                      alt="Illustration"
                      className="rounded-2xl w-96 shadow-lg"
                    />
                  </div>
                </div>
              }
            />

            {/* Other Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-sm text-slate-500 border-t mt-auto">
        Made with ❤️ by <span className="font-semibold">Yashwant</span>
      </footer>
    </div>
  );
}
