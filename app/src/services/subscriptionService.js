import axios from 'axios';
import authService from './authService';

const API_URL = '/api/subscriptions';

// Get subscription data for the current user
const getSubscription = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch subscription data');
  }
};

// Get all available subscription plans
const getPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/plans`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch subscription plans');
  }
};

// Create a checkout session for subscription
const createCheckoutSession = async (planId) => {
  try {
    const response = await axios.post(`${API_URL}/create-checkout`, {
      planId
    }, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create checkout session');
  }
};

// Cancel the current subscription
const cancelSubscription = async () => {
  try {
    const response = await axios.post(`${API_URL}/cancel`, {}, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
  }
};

// Reactivate a canceled subscription
const reactivateSubscription = async () => {
  try {
    const response = await axios.post(`${API_URL}/reactivate`, {}, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reactivate subscription');
  }
};

// Get payment history
const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/payment-history`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
  }
};

// Update payment method
const updatePaymentMethod = async () => {
  try {
    const response = await axios.post(`${API_URL}/update-payment`, {}, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update payment method');
  }
};

const subscriptionService = {
  getSubscription,
  getPlans,
  createCheckoutSession,
  cancelSubscription,
  reactivateSubscription,
  getPaymentHistory,
  updatePaymentMethod
};

export default subscriptionService; 