import api from '../config/api';

async function getMyRentals() {
  const token = localStorage.getItem('token');
  const response = await fetch(api.tenant.rentals(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch rentals');
  }
  
  const data = await response.json();
  return data.data.rentals;
}

const rentalService = { getMyRentals };
export default rentalService;
