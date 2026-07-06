import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("resetEmail");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        password,
      });

      setMessage(res.data.msg);
      localStorage.removeItem("resetEmail");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Reset error:", err.response?.data || err.message);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 mb-3 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded"
        >
          Reset Password
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-green-600">{message}</p>
      )}
    </div>
  );
}
