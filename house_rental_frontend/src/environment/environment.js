// central environment configuration for frontend

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const STORAGE_URL = 'http://127.0.0.1:8000/storage';

// Helper function to get full image URL from photo_path
const getImageUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http')) return photoPath;
  return `${STORAGE_URL}/${photoPath}`;
};

// Helper function to get profile picture URL
const getProfileUrl = (profilePath) => {
  if (!profilePath) return null;
  console.log('Profile Path:', profilePath);
  // if (profilePath.startsWith('http')) return profilePath;
  return `http://127.0.0.1:8000/storage/${profilePath}`;
};

const env = {
    API_BASE_URL,
    STORAGE_URL,
    getImageUrl,
    getProfileUrl,
};

export default env;