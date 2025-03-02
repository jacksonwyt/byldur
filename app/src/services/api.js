import axios from 'axios';

// Create a base axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Required for cookies and authentication
});

// Add request interceptor to include auth token with each request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('byldur-token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error responses
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      // Clear token if it exists
      if (localStorage.getItem('byldur-token')) {
        localStorage.removeItem('byldur-token');
        
        // Refresh the page to reset application state
        window.location.href = '/login?session=expired';
      }
    }
    
    // Format error message for easier consumption
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred';
    
    // Enhance error object with a more accessible message
    error.displayMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

export default api; 