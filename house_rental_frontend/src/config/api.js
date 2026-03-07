import env from '../environment/environment';

const API_BASE_URL = env.API_BASE_URL;

export default {
  baseUrl: API_BASE_URL,
  houses: () => `${API_BASE_URL}/landlord/houses`,
  auth: () => `${API_BASE_URL}/auth`,
  // add other endpoints as needed
};
