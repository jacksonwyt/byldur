import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import authService from './authService';

const API_URL = '/api/subscriptions';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Get all available subscription plans
const getPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/plans`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch subscription plans');
  }
};

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

// Create checkout session and redirect to Stripe checkout
const createCheckoutSession = async (planId) => {
  try {
    const response = await axios.post(`${API_URL}/create-checkout`, {
      planId
    }, {
      headers: authService.getAuthHeader()
    });
    
    const { sessionId } = response.data;
    const stripe = await stripePromise;
    
    return stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create checkout session');
  }
};

// Manage subscription (cancel, reactivate)
const manageSubscription = async (action) => {
  try {
    const response = await axios.post(`${API_URL}/${action}`, {}, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to ${action} subscription`);
  }
};

// Check if user has active subscription
const hasActiveSubscription = (subscription) => {
  return subscription && 
         subscription.status === 'active' && 
         (!subscription.canceledAt || new Date(subscription.endDate) > new Date());
};

// Get subscription tier
const getSubscriptionTier = (subscription) => {
  if (!subscription || subscription.status !== 'active') return 'free';
  return subscription.plan.tier;
};

const stripeService = {
  getPlans,
  getSubscription,
  createCheckoutSession,
  cancelSubscription: () => manageSubscription('cancel'),
  reactivateSubscription: () => manageSubscription('reactivate'),
  hasActiveSubscription,
  getSubscriptionTier,
  stripePromise
};

export default stripeService;