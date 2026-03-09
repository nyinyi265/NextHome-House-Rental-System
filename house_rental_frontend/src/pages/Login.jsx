import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <button 
            type="submit" 
            className="bg-emerald-600 text-white py-2.5 rounded cursor-pointer border-none hover:bg-emerald-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-emerald-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
