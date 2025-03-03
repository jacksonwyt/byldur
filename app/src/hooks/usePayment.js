import { useState, useCallback } from 'react';
import stripeService from '../services/stripeService';
import useApi from './useApi';

/**
 * Simplified hook for payment/subscription functionality
 */
const usePayment = () => {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const api = useApi('/api/subscriptions');

  // Fetch current subscription
  const fetchSubscription = useCallback(async () => {
    const data = await stripeService.getSubscription();
    setSubscription(data);
    return data;
  }, []);

  // Fetch available plans
  const fetchPlans = useCallback(async () => {
    const data = await stripeService.getPlans();
    setPlans(data);
    return data;
  }, []);

  // Create checkout session
  const checkout = useCallback(async (planId) => {
    return stripeService.createCheckoutSession(planId);
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    await stripeService.cancelSubscription();
    return fetchSubscription(); // Refresh subscription data
  }, [fetchSubscription]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    await stripeService.reactivateSubscription();
    return fetchSubscription(); // Refresh subscription data
  }, [fetchSubscription]);

  // Check if user has active subscription
  const hasActiveSubscription = useCallback(() => {
    return stripeService.hasActiveSubscription(subscription);
  }, [subscription]);

  // Get subscription tier
  const getSubscriptionTier = useCallback(() => {
    return stripeService.getSubscriptionTier(subscription);
  }, [subscription]);

  return {
    subscription,
    plans,
    loading: api.loading,
    error: api.error,
    fetchSubscription,
    fetchPlans,
    checkout,
    cancelSubscription,
    reactivateSubscription,
    hasActiveSubscription,
    getSubscriptionTier,
    clearError: api.clearError
  };
};

export default usePayment;