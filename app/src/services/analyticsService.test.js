import ReactGA from 'react-ga4';
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
} from './analyticsService';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
  set: jest.fn(),
}));

// Mock console.log and console.warn to avoid cluttering test output
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

describe('analyticsService', () => {
  beforeEach(() => {
    // Suppress console output during tests
    console.log = jest.fn();
    console.warn = jest.fn();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original console methods after all tests
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
  });

  describe('initializeAnalytics', () => {
    it('initializes GA with the measurement ID when available', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, REACT_APP_GA_TRACKING_ID: 'UA-TEST-ID' };
      
      const result = initializeAnalytics();
      
      expect(ReactGA.initialize).toHaveBeenCalledWith('UA-TEST-ID');
      expect(result).toBe(true);
      
      process.env = originalEnv;
    });
    
    it('returns false and logs warning when measurement ID is not available', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, REACT_APP_GA_TRACKING_ID: undefined };
      
      const result = initializeAnalytics();
      
      expect(ReactGA.initialize).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith('Google Analytics Measurement ID not found. Analytics will not be tracked.');
      expect(result).toBe(false);
      
      process.env = originalEnv;
    });
  });
  
  describe('trackPageView', () => {
    it('calls ReactGA.send with correct parameters', () => {
      trackPageView('/test-page');
      
      expect(ReactGA.send).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/test-page'
      });
    });
  });
  
  describe('trackAuthEvent', () => {
    it('calls ReactGA.event with correct parameters for auth events', () => {
      trackAuthEvent('sign_in', 'google');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Authentication',
        action: 'sign_in',
        label: 'google',
      });
    });
    
    it('uses "direct" as default method if not provided', () => {
      trackAuthEvent('sign_up');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Authentication',
        action: 'sign_up',
        label: 'direct',
      });
    });
  });
  
  describe('trackFeatureUsage', () => {
    it('calls ReactGA.event with correct parameters for feature usage', () => {
      trackFeatureUsage('analytics', 'enabled', 'dashboard');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Feature',
        action: 'analytics:enabled',
        label: 'dashboard',
      });
    });
    
    it('handles null label parameter', () => {
      trackFeatureUsage('analytics', 'disabled');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Feature',
        action: 'analytics:disabled',
        label: null,
      });
    });
  });
  
  describe('trackProjectEvent', () => {
    it('calls ReactGA.event with correct parameters for project events', () => {
      trackProjectEvent('created', 'project-123');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Project',
        action: 'created',
        label: 'project-123',
      });
    });
  });
  
  describe('trackEditorEvent', () => {
    it('calls ReactGA.event with correct parameters for editor events', () => {
      trackEditorEvent('component_added', 'button');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Editor',
        action: 'component_added',
        label: 'button',
      });
    });
    
    it('handles null label parameter', () => {
      trackEditorEvent('content_saved');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Editor',
        action: 'content_saved',
        label: null,
      });
    });
  });
  
  describe('trackSubscriptionEvent', () => {
    it('calls ReactGA.event with correct parameters for subscription events', () => {
      trackSubscriptionEvent('subscription_started', 'premium');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Subscription',
        action: 'subscription_started',
        label: 'premium',
      });
    });
    
    it('handles null plan parameter', () => {
      trackSubscriptionEvent('viewed_plans');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Subscription',
        action: 'viewed_plans',
        label: null,
      });
    });
  });
  
  describe('trackError', () => {
    it('calls ReactGA.event with correct parameters for error events', () => {
      trackError('api_error', 'Failed to fetch projects');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Error',
        action: 'api_error',
        label: 'Failed to fetch projects',
      });
    });
  });
  
  describe('trackTiming', () => {
    it('calls ReactGA.send with correct parameters for timing events', () => {
      trackTiming('page_load', 'dashboard', 1500);
      
      expect(ReactGA.send).toHaveBeenCalledWith({
        hitType: 'timing',
        timingCategory: 'page_load',
        timingVar: 'dashboard',
        timingValue: 1500,
      });
    });
  });
  
  describe('setUserProperties', () => {
    it('calls ReactGA.set with the provided properties', () => {
      const userProps = { userId: 'user123', userRole: 'admin' };
      setUserProperties(userProps);
      
      expect(ReactGA.set).toHaveBeenCalledWith(userProps);
    });
  });
  
  describe('trackCustomEvent', () => {
    it('calls ReactGA.event with all provided parameters', () => {
      trackCustomEvent('test_category', 'test_action', 'test_label', 42);
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'test_category',
        action: 'test_action',
        label: 'test_label',
        value: 42,
      });
    });
    
    it('handles null label and value parameters', () => {
      trackCustomEvent('test_category', 'test_action');
      
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'test_category',
        action: 'test_action',
        label: null,
        value: null,
      });
    });
  });
}); 