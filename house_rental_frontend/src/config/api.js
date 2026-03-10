import env from '../environment/environment';

const API_BASE_URL = env.API_BASE_URL;

const base = (path) => `${API_BASE_URL}${path}`;

const endpoints = {
  baseUrl: API_BASE_URL,
  houses: () => base('/houses'),          // public/tenant browsing
  tenantHouses: () => base('/tenant/houses'),
  landlordHouses: () => base('/landlord/houses'),
  amenties: () => base('/amenties'),
  landlord: {
    houses: () => base('/landlord/houses'),
    amenties: () => base('/landlord/amenties'),
    furnitures: () => base('/landlord/furnitures'),
    rentalApplications: () => base('/landlord/rental-applications'),
    rentals: () => base('/landlord/rentals'),
  },
  tenant: {
    rentalApplications: () => base('/tenant/rental-applications'),
  },
  auth: {
    login: () => base('/auth/login'),
    register: () => base('/auth/register'),
    me: () => base('/auth/me'),
    logout: () => base('/auth/logout'),
    updateProfile: () => base('/auth/profile'),
    forgotPassword: () => base('/auth/forgot-password'),
    resetPassword: () => base('/auth/reset-password'),
  },
  // add other endpoints as needed
};

export default endpoints;
