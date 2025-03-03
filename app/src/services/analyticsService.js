import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initializeAnalytics = () => {
  const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_TRACKING_ID;
  
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    return true;
  } else {
    console.warn('Google Analytics Measurement ID not found. Analytics will not be tracked.');
    return false;
  }
};

// Generic event tracking function
export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track page views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Set user properties
export const setUserProperties = (properties) => {
  ReactGA.set(properties);
};

// Event category constants
export const CATEGORIES = {
  AUTH: 'Authentication',
  PROJECT: 'Project',
  EDITOR: 'Editor',
  SUBSCRIPTION: 'Subscription',
  FEATURE: 'Feature',
  ERROR: 'Error'
};

// Specific analytics tracking functions

// Track authentication events
export const trackAuthEvent = (action, method = null) => {
  trackEvent(CATEGORIES.AUTH, action, method);
};

// Track feature usage
export const trackFeatureUsage = (feature, action) => {
  trackEvent(CATEGORIES.FEATURE, action, feature);
};

// Track errors
export const trackError = (action, errorMessage = null) => {
  trackEvent(CATEGORIES.ERROR, action, errorMessage);
};