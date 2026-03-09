import api from '../config/api';

/**
 * Fetch a list of houses. The endpoint chosen depends on the user's
 * authentication state and role.
 *
 * @param {string|null} token
 * @param {string|null} role  one of 'landlord' | 'tenant' or null
 * @param {object} filters - optional filters
 */
async function list(token, role, filters = {}) {
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

  // Add filter query params
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key + '[]', v));
      } else {
        params.append(key, value);
      }
    }
  });
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
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

/**
 * Fetch all amenities
 */
async function getAmenties() {
  const headers = { Accept: 'application/json' };
  const response = await fetch(api.amenties(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}


const houseService = { list, get, getAmenties };
export default houseService;