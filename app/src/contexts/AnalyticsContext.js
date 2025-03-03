import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeAnalytics, 
  trackPageView,
  trackEvent,
  setUserProperties,
  CATEGORIES
} from '../services/analyticsService';
import useAuthApi from '../hooks/useAuthApi';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthApi();
  const [initialized, setInitialized] = useState(false);
  
  // Initialize analytics
  useEffect(() => {
    if (!initialized) {
      const success = initializeAnalytics();
      setInitialized(success);
    }
  }, [initialized]);
  
  // Track page views
  useEffect(() => {
    if (initialized) {
      trackPageView(location.pathname + location.search);
    }
  }, [initialized, location]);
  
  // Set user properties when authenticated
  useEffect(() => {
    if (initialized && isAuthenticated && user) {
      setUserProperties({
        userId: user.id,
        userRole: user.role || 'user',
        userPlan: user.plan || 'free',
      });
    }
  }, [initialized, isAuthenticated, user]);
  
  // Define analytics tracking methods
  const analytics = {
    // Auth events
    trackAuth: (action, method = 'direct') => trackEvent(CATEGORIES.AUTH, action, method),
    
    // Project events
    trackProject: (action, projectId) => trackEvent(CATEGORIES.PROJECT, action, projectId),
    
    // Editor events
    trackEditor: (action, label = null) => trackEvent(CATEGORIES.EDITOR, action, label),
    
    // Subscription events
    trackSubscription: (action, plan = null) => trackEvent(CATEGORIES.SUBSCRIPTION, action, plan),
    
    // Feature usage
    trackFeature: (feature, action, label) => trackEvent(CATEGORIES.FEATURE, `${feature}:${action}`, label),
    
    // Error tracking
    trackError: (errorType, errorMessage) => trackEvent(CATEGORIES.ERROR, errorType, errorMessage),
  };
  
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;