import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            className="mt-1 block w-full p-2 border rounded"
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            className="mt-1 block w-full p-2 border rounded"
            placeholder="Enter password"
            required
          />
        </div>

        <button className="w-full py-2 rounded bg-slate-800 text-white hover:bg-slate-900">
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
