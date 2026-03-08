import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      authService.me(storedToken)
        .then((res) => setUser(res.user || res))
        .catch(() => logout());
    }
  }, []);

  async function login(credentials) {
    const res = await authService.login(credentials);
    setToken(res.token);
    setUser(res.user || res);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.user || res));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
