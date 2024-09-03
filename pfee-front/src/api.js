import axios from 'axios';

// Create an instance of axios with a dynamic base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000' // Backend base URL
});

// Add a request interceptor to include JWT in the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized errors, e.g., redirect to login
    // You might need to handle this differently depending on your setup
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  }
  return Promise.reject(error);
});

export default api;
