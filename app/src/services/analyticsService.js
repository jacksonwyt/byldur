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

// Track page views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
  console.log(`Analytics: Pageview tracked for ${path}`);
};

// Track user authentication events
export const trackAuthEvent = (action, method = 'direct') => {
  ReactGA.event({
    category: 'Authentication',
    action,
    label: method,
  });
  console.log(`Analytics: Auth event tracked - ${action} via ${method}`);
};

// Track user interactions with features
export const trackFeatureUsage = (feature, action, label = null) => {
  ReactGA.event({
    category: 'Feature',
    action: `${feature}:${action}`,
    label,
  });
  console.log(`Analytics: Feature usage tracked - ${feature}:${action}${label ? ` (${label})` : ''}`);
};

// Track project-related events
export const trackProjectEvent = (action, projectId) => {
  ReactGA.event({
    category: 'Project',
    action,
    label: projectId,
  });
  console.log(`Analytics: Project event tracked - ${action} for project ${projectId}`);
};

// Track editor-related events
export const trackEditorEvent = (action, label = null) => {
  ReactGA.event({
    category: 'Editor',
    action,
    label,
  });
  console.log(`Analytics: Editor event tracked - ${action}${label ? ` (${label})` : ''}`);
};

// Track subscription/payment-related events
export const trackSubscriptionEvent = (action, plan = null) => {
  ReactGA.event({
    category: 'Subscription',
    action,
    label: plan,
  });
  console.log(`Analytics: Subscription event tracked - ${action}${plan ? ` for plan ${plan}` : ''}`);
};

// Track error events
export const trackError = (errorType, errorMessage) => {
  ReactGA.event({
    category: 'Error',
    action: errorType,
    label: errorMessage,
  });
  console.log(`Analytics: Error tracked - ${errorType}: ${errorMessage}`);
};

// Track time spent on a page or feature
export const trackTiming = (category, variable, value) => {
  ReactGA.send({
    hitType: "timing",
    timingCategory: category,
    timingVar: variable,
    timingValue: value,
  });
  console.log(`Analytics: Timing tracked - ${category}:${variable} - ${value}ms`);
};

// Set user properties
export const setUserProperties = (properties) => {
  ReactGA.set(properties);
  console.log(`Analytics: User properties set`, properties);
};

// Track a custom event
export const trackCustomEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
  console.log(`Analytics: Custom event tracked - ${category}:${action}${label ? ` (${label})` : ''}${value ? ` = ${value}` : ''}`);
}; 