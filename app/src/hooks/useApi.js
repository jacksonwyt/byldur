import { useState, useCallback } from 'react';
import axios from 'axios';
import authService from '../services/authService';

/**
 * A reusable hook for API operations that handles loading states and errors.
 * Can be configured for different endpoints and operations.
 */
const useApi = (baseUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get auth headers
  const getHeaders = useCallback((requireAuth = true) => {
    return requireAuth ? authService.getAuthHeader() : {};
  }, []);

  // Generic request function
  const request = useCallback(async (method, endpoint, data = null, requireAuth = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${baseUrl}${endpoint}`;
      const headers = getHeaders(requireAuth);
      
      const config = {
        method,
        url,
        headers,
        ...(data && method !== 'GET' ? { data } : {}),
        ...(data && method === 'GET' ? { params: data } : {})
      };
      
      const response = await axios(config);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getHeaders]);

  // Convenience methods for common HTTP methods
  const get = useCallback((endpoint, params = null, requireAuth = true) => {
    return request('GET', endpoint, params, requireAuth);
  }, [request]);
  
  const post = useCallback((endpoint, data = null, requireAuth = true) => {
    return request('POST', endpoint, data, requireAuth);
  }, [request]);
  
  const put = useCallback((endpoint, data = null, requireAuth = true) => {
    return request('PUT', endpoint, data, requireAuth);
  }, [request]);
  
  const del = useCallback((endpoint, requireAuth = true) => {
    return request('DELETE', endpoint, null, requireAuth);
  }, [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
    clearError: () => setError(null)
  };
};

export default useApi;