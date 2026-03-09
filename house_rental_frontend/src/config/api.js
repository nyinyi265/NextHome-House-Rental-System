import env from '../environment/environment';

const API_BASE_URL = env.API_BASE_URL;

const base = (path) => `${API_BASE_URL}${path}`;

const endpoints = {
  baseUrl: API_BASE_URL,
  houses: () => base('/houses'),          // public/tenant browsing
  tenantHouses: () => base('/tenant/houses'),
  landlordHouses: () => base('/landlord/houses'),
  amenties: () => base('/amenties'),
  auth: {
    login: () => base('/auth/login'),
    register: () => base('/auth/register'),
    me: () => base('/auth/me'),
    logout: () => base('/auth/logout'),
  },
  // add other endpoints as needed
};

export default endpoints;
