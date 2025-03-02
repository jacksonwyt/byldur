import React from 'react';
import { render, act } from '@testing-library/react';
import { AnalyticsContext, AnalyticsProvider } from './AnalyticsContext';
import * as analyticsService from '../services/analyticsService';

// Mock the react-router-dom useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '/test',
    search: '',
  })),
}));

// Mock the useAuth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn().mockImplementation(() => ({
    user: { id: 'test-user', role: 'user', plan: 'free' },
    isAuthenticated: true,
  })),
}));

// Mock the analytics service functions
jest.mock('../services/analyticsService', () => ({
  initializeAnalytics: jest.fn().mockReturnValue(true),
  trackPageView: jest.fn(),
  trackAuthEvent: jest.fn(),
  trackFeatureUsage: jest.fn(),
  trackProjectEvent: jest.fn(),
  trackEditorEvent: jest.fn(),
  trackSubscriptionEvent: jest.fn(),
  trackError: jest.fn(),
  trackTiming: jest.fn(),
  setUserProperties: jest.fn(),
  trackCustomEvent: jest.fn(),
}));

describe('AnalyticsContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes analytics on mount', () => {
    render(
      <AnalyticsProvider>
        <div>Test</div>
      </AnalyticsProvider>
    );

    expect(analyticsService.initializeAnalytics).toHaveBeenCalledTimes(1);
  });

  it('tracks page view when location changes', () => {
    render(
      <AnalyticsProvider>
        <div>Test</div>
      </AnalyticsProvider>
    );

    expect(analyticsService.trackPageView).toHaveBeenCalledWith('/test');
  });

  it('sets user properties when user is authenticated', () => {
    render(
      <AnalyticsProvider>
        <div>Test</div>
      </AnalyticsProvider>
    );

    expect(analyticsService.setUserProperties).toHaveBeenCalledWith({
      userId: 'test-user',
      userRole: 'user',
      userPlan: 'free',
    });
  });

  it('provides tracking methods through context', () => {
    // Create a test component that consumes the context
    const TestComponent = () => {
      const analytics = React.useContext(AnalyticsContext);
      
      // Call a few tracking methods to test
      React.useEffect(() => {
        analytics.trackSignIn('google');
        analytics.trackProjectCreated('test-project');
        analytics.trackEditorOpened('test-project');
        analytics.trackError('test-error', 'Test error message');
      }, [analytics]);
      
      return <div>Test Component</div>;
    };

    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    );

    // Check if the corresponding service methods were called with correct parameters
    expect(analyticsService.trackAuthEvent).toHaveBeenCalledWith('sign_in', 'google');
    expect(analyticsService.trackProjectEvent).toHaveBeenCalledWith('created', 'test-project');
    expect(analyticsService.trackEditorEvent).toHaveBeenCalledWith('opened', 'test-project');
    expect(analyticsService.trackError).toHaveBeenCalledWith('test-error', 'Test error message');
  });
}); 