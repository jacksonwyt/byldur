import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import * as analyticsService from '../services/analyticsService';

// Create the Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('byldur-token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          
          // Track user authentication
          analyticsService.setUserProperties({
            userId: userData.id,
            userRole: userData.role || 'user',
            userPlan: userData.plan || 'free',
          });
        } catch (err) {
          console.error('Authentication error:', err);
          localStorage.removeItem('byldur-token');
          setToken(null);
          setError('Authentication session expired. Please log in again.');
          
          // Track authentication error
          analyticsService.trackError('auth_session_expired', err.message || 'Session expired');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      
      localStorage.setItem('byldur-token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      // Track successful login
      analyticsService.trackAuthEvent('sign_in', 'email');
      
      return response.user;
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      
      // Track login error
      analyticsService.trackError('login_failed', err.message || 'Failed to login');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      
      localStorage.setItem('byldur-token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      // Track successful registration
      analyticsService.trackAuthEvent('sign_up', 'email');
      
      return response.user;
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      
      // Track registration error
      analyticsService.trackError('registration_failed', err.message || 'Failed to register');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
      
      // Track logout
      analyticsService.trackAuthEvent('sign_out');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Track logout error
      analyticsService.trackError('logout_failed', error.message || 'Logout failed');
    } finally {
      localStorage.removeItem('byldur-token');
      setToken(null);
      setUser(null);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      
      // Track profile update
      analyticsService.trackFeatureUsage('profile', 'updated');
      
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      
      // Track profile update error
      analyticsService.trackError('profile_update_failed', err.message || 'Failed to update profile');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await authService.requestPasswordReset(email);
      
      // Track password reset request
      analyticsService.trackAuthEvent('password_reset_request');
    } catch (err) {
      setError(err.message || 'Failed to request password reset. Please try again.');
      
      // Track password reset request error
      analyticsService.trackError('password_reset_request_failed', err.message || 'Failed to request password reset');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
      
      // Track password reset
      analyticsService.trackAuthEvent('password_reset_complete');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
      
      // Track password reset error
      analyticsService.trackError('password_reset_failed', err.message || 'Failed to reset password');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await authService.changePassword(currentPassword, newPassword);
      
      // Track password change
      analyticsService.trackAuthEvent('password_changed');
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
      
      // Track password change error
      analyticsService.trackError('password_change_failed', err.message || 'Failed to change password');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    changePassword,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 