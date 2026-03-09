import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../config/api";

export default function Register() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // call register endpoint then log in with returned token
      const res = await fetch(api.auth.register(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone_number: phoneNumber }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      // data may contain token + user
      if (data.token) {
        await login(data);
      }
      navigate("/");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-600 text-white py-2.5 rounded cursor-pointer border-none hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
