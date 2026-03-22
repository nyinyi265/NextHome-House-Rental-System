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

/**
 * Fetch all furniture
 */
async function getFurnitures() {
  const headers = { Accept: 'application/json' };
  const response = await fetch(api.furnitures(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Submit a rental application for a house
 * @param {string} token - Authentication token
 * @param {number} houseId - House ID to apply for
 * @param {string} message - Optional message to the host
 * @param {number} rentalDuration - Rental duration in months
 */
async function applyRental(token, houseId, message = '', rentalDuration = 3) {
  const headers = { 
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  
  const body = JSON.stringify({
    house_id: houseId,
    message: message,
    rental_duration: rentalDuration
  });
  
  const response = await fetch(api.tenant.rentalApplications(), {
    method: 'POST',
    headers,
    body
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Fetch amenities for landlord
 */
async function getLandlordAmenties(token) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response = await fetch(api.landlord.amenties(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Fetch furnitures for landlord
 */
async function getLandlordFurnitures(token) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response = await fetch(api.landlord.furnitures(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Create a new house listing (landlord)
 * @param {string} token - Authentication token
 * @param {FormData} formData - House data including photos, amenities, furniture
 */
async function createHouse(token, formData) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
    // Note: Don't set Content-Type for FormData - browser will set it with boundary
  };
  
  const response = await fetch(api.landlord.houses(), {
    method: 'POST',
    headers,
    body: formData
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Update an existing house listing (landlord)
 * @param {string} token - Authentication token
 * @param {number} houseId - House ID to update
 * @param {FormData} formData - House data including photos, amenities, furniture
 */
async function updateHouse(token, houseId, formData) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
    // Note: Don't set Content-Type for FormData - browser will set it with boundary
  };
  
  const response = await fetch(`${api.landlord.houses()}/${houseId}`, {
    method: 'POST', // Laravel uses POST with _method override for PUT
    headers,
    body: formData
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Delete a house listing (landlord) - soft delete
 * @param {string} token - Authentication token
 * @param {number} houseId - House ID to delete
 */
async function deleteHouse(token, houseId) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  
  const response = await fetch(`${api.landlord.houses()}/${houseId}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Fetch rental applications for landlord's properties
 * @param {string} token - Authentication token
 */
async function getLandlordRentalApplications(token) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response = await fetch(api.landlord.rentalApplications(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Update rental application status (approve/deny)
 * @param {string} token - Authentication token
 * @param {number} applicationId - Application ID
 * @param {string} status - 'approved' or 'rejected'
 */
async function updateRentalApplicationStatus(token, applicationId, status) {
  const headers = { 
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  
  const response = await fetch(`${api.landlord.rentalApplications()}/${applicationId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Update rental application duration
 * @param {string} token - Authentication token
 * @param {number} applicationId - Application ID
 * @param {number} rentalDuration - Duration in months
 */
async function updateRentalApplicationDuration(token, applicationId, rentalDuration) {
  const headers = { 
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  
  const response = await fetch(`${api.landlord.rentalApplications()}/${applicationId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ rental_duration: rentalDuration })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Fetch rentals for landlord's properties
 * @param {string} token - Authentication token
 */
async function getLandlordRentals(token) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response = await fetch(api.landlord.rentals(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

/**
 * Fetch tenant's rental applications
 * @param {string} token - Authentication token
 */
async function getTenantRentalApplications(token) {
  const headers = { 
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response = await fetch(api.tenant.rentalApplications(), { headers });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}


const houseService = { 
  list, 
  get, 
  getAmenties, 
  getFurnitures,
  applyRental,
  getLandlordAmenties,
  getLandlordFurnitures,
  createHouse,
  updateHouse,
  deleteHouse,
  getLandlordRentalApplications,
  updateRentalApplicationStatus,
  updateRentalApplicationDuration,
  getLandlordRentals,
  getTenantRentalApplications
};
export default houseService;