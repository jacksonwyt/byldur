import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} - User object with token
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Registration failed');
  }
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User object with token
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Login failed');
  }
};

/**
 * Logout the current user
 * @returns {Promise<boolean>} - Success indicator
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Still return true to allow client-side logout
    return true;
  }
};

/**
 * Get the current authenticated user's data
 * @returns {Promise<Object>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Failed to get user info');
  }
};

/**
 * Update the current user's profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Failed to update profile');
  }
};

/**
 * Request a password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response object
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Failed to request password reset');
  }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} - Response object
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Failed to reset password');
  }
};

/**
 * Change the current user's password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response object
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.displayMessage || 'Failed to change password');
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  changePassword
};

export default authService; 