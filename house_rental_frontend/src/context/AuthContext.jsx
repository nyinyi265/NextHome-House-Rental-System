import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        // If parsing fails, try to fetch user from API
        authService.me(storedToken)
          .then((res) => {
            const userData = res.data?.user || res.user || res;
            const roleData = res.data?.role || res.role;
            setUser({ ...userData, role: roleData });
          })
          .catch(() => logout());
      }
    }
  }, []);

  async function login(credentials) {
    const res = await authService.login(credentials);
    // API response structure: { status, statusCode, data: { user, token, role }, message }
    const userData = res.data?.user || res.user || res;
    const tokenData = res.data?.token || res.token;
    const roleData = res.data?.role || res.role;
    
    // Include role in user data
    const userWithRole = { ...userData, role: roleData };
    
    setToken(tokenData);
    setUser(userWithRole);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    
    // Return user data with role for navigation
    return userWithRole;
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
