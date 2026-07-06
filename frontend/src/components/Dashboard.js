import React,{useEffect,useState} from 'react';
import API from '../api';import {useNavigate} from 'react-router-dom';
export default function Dashboard(){const [user,setUser]=useState(null);const nav=useNavigate();
useEffect(()=>{(async()=>{try{const res=await API.get('/auth/me');setUser(res.data);}catch{localStorage.removeItem('token');nav('/login');}})();},[nav]);
const logout=()=>{localStorage.removeItem('token');nav('/login');};
if(!user)return<div className="text-center p-6">Loading...</div>;
return(<div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto text-center"><h2 className="text-2xl font-semibold">Welcome, {user.name}</h2><p className="text-sm text-slate-600">{user.email}</p><div className="mt-6">
<button onClick={logout} className="px-4 py-2 rounded bg-red-600 text-white">Logout</button></div></div>);}