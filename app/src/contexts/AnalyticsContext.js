import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeAnalytics, 
  trackPageView, 
  trackAuthEvent,
  trackFeatureUsage,
  trackProjectEvent,
  trackEditorEvent,
  trackSubscriptionEvent,
  trackError,
  trackTiming,
  setUserProperties,
  trackCustomEvent
} from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
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
  
  // Define analytics tracking methods to expose through context
  const analytics = {
    // Auth events
    trackSignIn: (method = 'direct') => trackAuthEvent('sign_in', method),
    trackSignUp: (method = 'direct') => trackAuthEvent('sign_up', method),
    trackSignOut: () => trackAuthEvent('sign_out'),
    trackPasswordReset: () => trackAuthEvent('password_reset'),
    
    // Feature usage
    trackFeatureUsage: (feature, action, label) => trackFeatureUsage(feature, action, label),
    
    // Project events
    trackProjectCreated: (projectId) => trackProjectEvent('created', projectId),
    trackProjectUpdated: (projectId) => trackProjectEvent('updated', projectId),
    trackProjectDeleted: (projectId) => trackProjectEvent('deleted', projectId),
    trackProjectPublished: (projectId) => trackProjectEvent('published', projectId),
    trackProjectUnpublished: (projectId) => trackProjectEvent('unpublished', projectId),
    trackProjectDeployed: (projectId) => trackProjectEvent('deployed', projectId),
    trackProjectDuplicated: (projectId) => trackProjectEvent('duplicated', projectId),
    
    // Editor events
    trackEditorOpened: (projectId) => trackEditorEvent('opened', projectId),
    trackComponentAdded: (componentType) => trackEditorEvent('component_added', componentType),
    trackComponentDeleted: (componentType) => trackEditorEvent('component_deleted', componentType),
    trackStyleChanged: () => trackEditorEvent('style_changed'),
    trackContentSaved: () => trackEditorEvent('content_saved'),
    trackAIPromptSent: () => trackEditorEvent('ai_prompt_sent'),
    trackAIResponseApplied: () => trackEditorEvent('ai_response_applied'),
    
    // Subscription events
    trackSubscriptionViewed: () => trackSubscriptionEvent('viewed_plans'),
    trackSubscriptionStarted: (plan) => trackSubscriptionEvent('subscription_started', plan),
    trackSubscriptionChanged: (plan) => trackSubscriptionEvent('subscription_changed', plan),
    trackSubscriptionCancelled: (plan) => trackSubscriptionEvent('subscription_cancelled', plan),
    trackPaymentFailed: () => trackSubscriptionEvent('payment_failed'),
    
    // Error tracking
    trackError: (errorType, errorMessage) => trackError(errorType, errorMessage),
    
    // Timing measurements
    trackTiming: (category, variable, value) => trackTiming(category, variable, value),
    
    // Custom events
    trackCustomEvent: (category, action, label, value) => trackCustomEvent(category, action, label, value),
  };
  
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider; 