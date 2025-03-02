import axios from 'axios';
import authService from './authService';

const API_URL = '/api/ai';

// Create axios instance with timeout
const aiAxios = axios.create({
  timeout: 60000, // 60 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth headers
aiAxios.interceptors.request.use(
  config => {
    // Add auth headers to every request
    const authHeaders = authService.getAuthHeader();
    config.headers = {
      ...config.headers,
      ...authHeaders
    };
    return config;
  },
  error => Promise.reject(error)
);

// Handle common AI service errors
const handleApiError = (error, defaultMessage) => {
  console.error('AI Service Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const serverMessage = error.response.data?.message || error.response.data?.error;
    throw new Error(serverMessage || defaultMessage);
  } else if (error.request) {
    // The request was made but no response was received
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again later.');
    }
    throw new Error('No response from server. Please check your connection and try again.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || defaultMessage);
  }
};

// Get AI credits for the current user
const getCredits = async () => {
  try {
    const response = await aiAxios.get(`${API_URL}/credits`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch AI credits');
  }
};

// Get AI usage history
const getUsageHistory = async () => {
  try {
    const response = await aiAxios.get(`${API_URL}/usage`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch AI usage history');
  }
};

// Generate website content
const generateWebsite = async (prompt, options = {}) => {
  try {
    const response = await aiAxios.post(`${API_URL}/generate-website`, {
      prompt,
      ...options
    });
    
    return formatAiResponse(response.data);
  } catch (error) {
    handleApiError(error, 'Failed to generate website content');
  }
};

// Generate component or section
const generateComponent = async (prompt, type, options = {}) => {
  try {
    const response = await aiAxios.post(`${API_URL}/generate-component`, {
      prompt,
      type,
      ...options
    });
    
    return formatAiResponse(response.data);
  } catch (error) {
    handleApiError(error, `Failed to generate ${type}`);
  }
};

// Get AI suggestions for improvements
const getSuggestions = async (html, css, options = {}) => {
  try {
    const response = await aiAxios.post(`${API_URL}/suggestions`, {
      html,
      css,
      ...options
    });
    
    return formatAiResponse(response.data);
  } catch (error) {
    handleApiError(error, 'Failed to get AI suggestions');
  }
};

// Purchase AI credits
const purchaseCredits = async (amount) => {
  try {
    const response = await aiAxios.post(`${API_URL}/purchase-credits`, {
      amount
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to purchase AI credits');
  }
};

// Explain code
const explainCode = async (code) => {
  try {
    const response = await aiAxios.post(`${API_URL}/explain-code`, {
      code
    });
    
    return formatAiResponse(response.data);
  } catch (error) {
    handleApiError(error, 'Failed to explain code');
  }
};

// Generate text content
const generateText = async (prompt, options = {}) => {
  try {
    const response = await aiAxios.post(`${API_URL}/generate-text`, {
      prompt,
      ...options
    });
    
    return formatAiResponse(response.data);
  } catch (error) {
    handleApiError(error, 'Failed to generate text content');
  }
};

// Format AI response to ensure it has consistent structure
const formatAiResponse = (data) => {
  // If data is already in the expected format, return it
  if (data && data.content && typeof data.content === 'string') {
    return data;
  }
  
  // If data is a string, wrap it in the expected format
  if (typeof data === 'string') {
    return { content: data };
  }
  
  // If data is an object with a message property, use that
  if (data && data.message && typeof data.message === 'string') {
    return { content: data.message };
  }
  
  // If data is an object with html property, use that
  if (data && data.html && typeof data.html === 'string') {
    return { content: data.html };
  }
  
  // If no recognizable format, return an error message
  console.error('Unexpected AI response format:', data);
  return { 
    content: 'Received an unexpected response format from the AI service.',
    error: true
  };
};

const aiService = {
  getCredits,
  getUsageHistory,
  generateWebsite,
  generateComponent,
  getSuggestions,
  purchaseCredits,
  explainCode,
  generateText
};

export default aiService; 