import api from '../config/api';

async function login(credentials) {
  const response = await fetch(api.auth.login(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  console.log('Login response:', response);
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json(); // expects { token: '...', user: {...} }
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

const authService = { login, register, me };
export default authService;
