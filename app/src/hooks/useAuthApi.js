import { useState, useCallback, useEffect } from 'react';
import useApi from './useApi';
import { useAnalytics } from './useAnalytics';


/**
 * Hook for authentication API operations
 * Manages user authentication state and provides auth-related operations
 */
const useAuthApi = () => {
  const authApi = useApi('/api/auth');
  const analyticsService = useAnalytics();
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('byldur-token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          
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
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication session expired. Please log in again.');
          
          // Track authentication error
          analyticsService.trackError('auth_session_expired', err.message || 'Session expired');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Get current user data
  const getCurrentUser = useCallback(async () => {
    const userData = await authApi.get('/me');
    return userData;
  }, [authApi]);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.post('/login', { email, password }, false);
      
      localStorage.setItem('byldur-token', response.token);
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
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
  }, [authApi]);

  // Register user
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.post('/register', userData, false);
      
      localStorage.setItem('byldur-token', response.token);
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
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
  }, [authApi]);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await authApi.post('/logout');
      
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
      setIsAuthenticated(false);
    }
  }, [authApi]);

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await authApi.put('/profile', userData);
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
  }, [authApi]);

  // Reset password request
  const requestPasswordReset = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.post('/forgot-password', { email }, false);
      
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
  }, [authApi]);

  // Reset password with token
  const resetPassword = useCallback(async (resetToken, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.post('/reset-password', { token: resetToken, password: newPassword }, false);
      
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
  }, [authApi]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.post('/change-password', { currentPassword, newPassword });
      
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
  }, [authApi]);

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    changePassword,
    getCurrentUser,
    
    // Utility
    clearError: () => {
      setError(null);
      authApi.clearError();
    }
  };
};

export default useAuthApi;