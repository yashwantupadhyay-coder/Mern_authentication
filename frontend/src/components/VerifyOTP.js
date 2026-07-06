import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("resetEmail");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setMessage(res.data.msg);
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Verify OTP</button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}
