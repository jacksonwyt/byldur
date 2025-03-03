import { useState, useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import useApi from './useApi';
import useAuthApi from './useAuthApi';

/**
 * Hook for payment and subscription API operations
 * Manages subscription state and provides payment-related operations
 */
const usePaymentApi = () => {
  const subscriptionApi = useApi('/api/subscriptions');
  const { isAuthenticated } = useAuthApi();
  
  // Initialize Stripe (outside of component lifecycle)
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  
  // State
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState({
    subscription: false,
    plans: false,
    paymentHistory: false,
    checkout: false,
    cancel: false,
    reactivate: false,
    updatePayment: false
  });
  const [error, setError] = useState({
    subscription: null,
    plans: null,
    paymentHistory: null,
    checkout: null,
    cancel: null,
    reactivate: null,
    updatePayment: null
  });

  // Fetch subscription data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    }
  }, [isAuthenticated]);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch current subscription data
  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      setLoading(prev => ({ ...prev, subscription: true }));
      setError(prev => ({ ...prev, subscription: null }));
      
      const data = await subscriptionApi.get('');
      setSubscription(data);
      return data;
    } catch (err) {
      setError(prev => ({ ...prev, subscription: err.message || 'Failed to fetch subscription' }));
      console.error('Error fetching subscription:', err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, subscription: false }));
    }
  }, [subscriptionApi, isAuthenticated]);

  // Fetch available subscription plans
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, plans: true }));
      setError(prev => ({ ...prev, plans: null }));
      
      const data = await subscriptionApi.get('/plans', null, false);
      setPlans(data);
      return data;
    } catch (err) {
      setError(prev => ({ ...prev, plans: err.message || 'Failed to fetch subscription plans' }));
      console.error('Error fetching plans:', err);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  }, [subscriptionApi]);

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    try {
      setLoading(prev => ({ ...prev, paymentHistory: true }));
      setError(prev => ({ ...prev, paymentHistory: null }));
      
      const data = await subscriptionApi.get('/payment-history');
      setPaymentHistory(data);
      return data;
    } catch (err) {
      setError(prev => ({ ...prev, paymentHistory: err.message || 'Failed to fetch payment history' }));
      console.error('Error fetching payment history:', err);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, paymentHistory: false }));
    }
  }, [subscriptionApi, isAuthenticated]);

  // Create checkout session and redirect to Stripe checkout
  const createCheckoutSession = useCallback(async (planId) => {
    try {
      setLoading(prev => ({ ...prev, checkout: true }));
      setError(prev => ({ ...prev, checkout: null }));
      
      const { sessionId } = await subscriptionApi.post('/create-checkout', { planId });
      
      // Get Stripe instance
      const stripe = await stripePromise;
      
      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    } catch (err) {
      setError(prev => ({ ...prev, checkout: err.message || 'Failed to create checkout session' }));
      console.error('Error creating checkout session:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  }, [subscriptionApi, stripePromise]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, cancel: true }));
      setError(prev => ({ ...prev, cancel: null }));
      
      await subscriptionApi.post('/cancel');
      
      // Refresh subscription data
      await fetchSubscription();
      return true;
    } catch (err) {
      setError(prev => ({ ...prev, cancel: err.message || 'Failed to cancel subscription' }));
      console.error('Error canceling subscription:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, cancel: false }));
    }
  }, [subscriptionApi, fetchSubscription]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, reactivate: true }));
      setError(prev => ({ ...prev, reactivate: null }));
      
      await subscriptionApi.post('/reactivate');
      
      // Refresh subscription data
      await fetchSubscription();
      return true;
    } catch (err) {
      setError(prev => ({ ...prev, reactivate: err.message || 'Failed to reactivate subscription' }));
      console.error('Error reactivating subscription:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, reactivate: false }));
    }
  }, [subscriptionApi, fetchSubscription]);

  // Update payment method
  const updatePaymentMethod = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, updatePayment: true }));
      setError(prev => ({ ...prev, updatePayment: null }));
      
      const { sessionId } = await subscriptionApi.post('/update-payment');
      
      // Get Stripe instance
      const stripe = await stripePromise;
      
      // Redirect to payment method update page
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    } catch (err) {
      setError(prev => ({ ...prev, updatePayment: err.message || 'Failed to update payment method' }));
      console.error('Error updating payment method:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, updatePayment: false }));
    }
  }, [subscriptionApi, stripePromise]);

  // Check if user has an active subscription
  const hasActiveSubscription = useCallback(() => {
    return subscription && 
           subscription.status === 'active' && 
           (!subscription.canceledAt || new Date(subscription.endDate) > new Date());
  }, [subscription]);

  // Get subscription tier
  const getSubscriptionTier = useCallback(() => {
    if (!subscription) return 'free';
    if (subscription.status !== 'active') return 'free';
    return subscription.plan?.tier || 'free';
  }, [subscription]);

  return {
    // External APIs
    stripe: stripePromise,
    
    // State
    subscription,
    plans,
    paymentHistory,
    loading,
    error,
    
    // Methods
    fetchSubscription,
    fetchPlans,
    fetchPaymentHistory,
    createCheckoutSession,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    
    // Helper methods
    hasActiveSubscription,
    getSubscriptionTier,
    
    // Utility
    clearError: () => {
      setError({
        subscription: null,
        plans: null,
        paymentHistory: null,
        checkout: null,
        cancel: null,
        reactivate: null,
        updatePayment: null
      });
      subscriptionApi.clearError();
    }
  };
};

export default usePaymentApi;