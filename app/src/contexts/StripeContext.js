import React, { createContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import subscriptionService from '../services/subscriptionService';
import { useAuth } from '../hooks/useAuth';

// Create the context
export const StripeContext = createContext();

// Initialize Stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const StripeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
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
  const fetchSubscription = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(prev => ({ ...prev, subscription: true }));
      setError(prev => ({ ...prev, subscription: null }));
      
      const data = await subscriptionService.getSubscription();
      setSubscription(data);
    } catch (err) {
      setError(prev => ({ ...prev, subscription: err.message || 'Failed to fetch subscription' }));
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(prev => ({ ...prev, subscription: false }));
    }
  };

  // Fetch available subscription plans
  const fetchPlans = async () => {
    try {
      setLoading(prev => ({ ...prev, plans: true }));
      setError(prev => ({ ...prev, plans: null }));
      
      const data = await subscriptionService.getPlans();
      setPlans(data);
    } catch (err) {
      setError(prev => ({ ...prev, plans: err.message || 'Failed to fetch subscription plans' }));
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(prev => ({ ...prev, paymentHistory: true }));
      setError(prev => ({ ...prev, paymentHistory: null }));
      
      const data = await subscriptionService.getPaymentHistory();
      setPaymentHistory(data);
    } catch (err) {
      setError(prev => ({ ...prev, paymentHistory: err.message || 'Failed to fetch payment history' }));
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(prev => ({ ...prev, paymentHistory: false }));
    }
  };

  // Create checkout session and redirect to Stripe checkout
  const createCheckoutSession = async (planId) => {
    try {
      setLoading(prev => ({ ...prev, checkout: true }));
      setError(prev => ({ ...prev, checkout: null }));
      
      const { sessionId } = await subscriptionService.createCheckoutSession(planId);
      
      // Get Stripe instance
      const stripe = await stripePromise;
      
      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(prev => ({ ...prev, checkout: err.message || 'Failed to create checkout session' }));
      console.error('Error creating checkout session:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(prev => ({ ...prev, cancel: true }));
      setError(prev => ({ ...prev, cancel: null }));
      
      await subscriptionService.cancelSubscription();
      
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
  };

  // Reactivate subscription
  const reactivateSubscription = async () => {
    try {
      setLoading(prev => ({ ...prev, reactivate: true }));
      setError(prev => ({ ...prev, reactivate: null }));
      
      await subscriptionService.reactivateSubscription();
      
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
  };

  // Update payment method
  const updatePaymentMethod = async () => {
    try {
      setLoading(prev => ({ ...prev, updatePayment: true }));
      setError(prev => ({ ...prev, updatePayment: null }));
      
      const { sessionId } = await subscriptionService.updatePaymentMethod();
      
      // Get Stripe instance
      const stripe = await stripePromise;
      
      // Redirect to payment method update page
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(prev => ({ ...prev, updatePayment: err.message || 'Failed to update payment method' }));
      console.error('Error updating payment method:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, updatePayment: false }));
    }
  };

  // Check if user has an active subscription
  const hasActiveSubscription = () => {
    return subscription && 
           subscription.status === 'active' && 
           (!subscription.canceledAt || new Date(subscription.endDate) > new Date());
  };

  // Get subscription tier
  const getSubscriptionTier = () => {
    if (!subscription) return 'free';
    if (subscription.status !== 'active') return 'free';
    return subscription.plan.tier;
  };

  // Value to be provided by the context
  const value = {
    stripe: stripePromise,
    subscription,
    plans,
    paymentHistory,
    loading,
    error,
    fetchSubscription,
    fetchPlans,
    fetchPaymentHistory,
    createCheckoutSession,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    hasActiveSubscription,
    getSubscriptionTier
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
}; 