// central environment configuration for frontend

const API_BASE_URL = 'http://127.0.0.1:8000/api';
// Use API storage proxy for CORS-friendly image loading
const STORAGE_URL = 'http://127.0.0.1:8000/api/storage';

// Helper function for full image path
const getImageUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http')) return photoPath;
  return `${STORAGE_URL}/${photoPath}`;
};

// Helper function for profile
const getProfileUrl = (profilePath) => {
  if (!profilePath) return null;
  console.log('Profile Path:', profilePath);
  return `${STORAGE_URL}/${profilePath}`;
};

// Helper function for documents
const getDocumentUrl = (docPath) => {
  if (!docPath) return null;
  if (docPath.startsWith('http')) return docPath;
  return `${STORAGE_URL}/${docPath}`;
};

const env = {
    API_BASE_URL,
    STORAGE_URL,
    getImageUrl,
    getProfileUrl,
    getDocumentUrl,
};

export default env;