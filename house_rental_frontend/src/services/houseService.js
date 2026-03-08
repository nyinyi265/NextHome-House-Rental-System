import api from '../config/api';

/**
 * Fetch a list of houses. The endpoint chosen depends on the user's
 * authentication state and role.
 *
 * @param {string|null} token
 * @param {string|null} role  one of 'landlord' | 'tenant' or null
 */
async function list(token, role) {
  const headers = { Accept: 'application/json' };
  let url;
  if (token && role === 'landlord') {
    url = api.landlordHouses();
    headers.Authorization = `Bearer ${token}`;
  } else if (token && role === 'tenant') {
    url = api.tenantHouses();
    headers.Authorization = `Bearer ${token}`;
  } else {
    url = api.houses();
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json(); // expects { houses: [...] }
}

async function get(id, token, role) {
  const headers = { Accept: 'application/json' };
  let url;
  if (token && role === 'landlord') {
    url = `${api.landlordHouses()}/${id}`;
    headers.Authorization = `Bearer ${token}`;
  } else if (token && role === 'tenant') {
    url = `${api.tenantHouses()}/${id}`;
    headers.Authorization = `Bearer ${token}`;
  } else {
    url = `${api.houses()}/${id}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  console.log('Get house response:', response);
  return response.json();
}


const houseService = { list, get };
export default houseService;