import api from '../config/api';

async function login(credentials) {
  const response = await fetch(api.auth.login(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  console.log('Login response status:', response.status);
  
  // Try to parse response as JSON
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // If not JSON, get text
    const text = await response.text();
    console.log('Login response text:', text);
  }
  
  if (!response.ok) {
    // Try to extract error message from various response formats
    const errorMessage = data?.message || data?.error || 'Login failed';
    throw new Error(errorMessage);
  }
  
  return data || { status: 'success' };
}

async function register(data) {
  const response = await fetch(api.auth.register(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

async function me(token) {
  const response = await fetch(api.auth.me(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Unable to fetch user');
  return response.json();
}

async function logout() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetch(api.auth.logout(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout API call failed', error);
    }
  }
}

const authService = { login, register, me, logout };
export default authService;
