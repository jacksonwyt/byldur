import { renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { AnalyticsContext } from '../contexts/AnalyticsContext';

// Mock the analytics context value
const mockAnalyticsValue = {
  trackPageView: jest.fn(),
  trackSignIn: jest.fn(),
  trackSignUp: jest.fn(),
  trackSignOut: jest.fn(),
  trackPasswordReset: jest.fn(),
  trackFeatureUsage: jest.fn(),
  trackProjectCreated: jest.fn(),
  trackProjectUpdated: jest.fn(),
  trackProjectDeleted: jest.fn(),
  trackProjectPublished: jest.fn(),
  trackProjectUnpublished: jest.fn(),
  trackProjectDeployed: jest.fn(),
  trackProjectDuplicated: jest.fn(),
  trackEditorOpened: jest.fn(),
  trackComponentAdded: jest.fn(),
  trackComponentDeleted: jest.fn(),
  trackStyleChanged: jest.fn(),
  trackContentSaved: jest.fn(),
  trackAIPromptSent: jest.fn(),
  trackAIResponseApplied: jest.fn(),
  trackSubscriptionViewed: jest.fn(),
  trackSubscriptionStarted: jest.fn(),
  trackSubscriptionChanged: jest.fn(),
  trackSubscriptionCancelled: jest.fn(),
  trackPaymentFailed: jest.fn(),
  trackError: jest.fn(),
  trackTiming: jest.fn(),
  trackCustomEvent: jest.fn(),
};

// Setup wrapper with context provider
const wrapper = ({ children }) => (
  <AnalyticsContext.Provider value={mockAnalyticsValue}>
    {children}
  </AnalyticsContext.Provider>
);

describe('useAnalytics', () => {
  it('should return the analytics context value', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    
    expect(result.current).toEqual(mockAnalyticsValue);
  });

  it('should have all required analytics tracking methods', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    
    // Check if all tracking methods exist
    expect(typeof result.current.trackPageView).toBe('function');
    expect(typeof result.current.trackSignIn).toBe('function');
    expect(typeof result.current.trackFeatureUsage).toBe('function');
    expect(typeof result.current.trackProjectCreated).toBe('function');
    expect(typeof result.current.trackEditorOpened).toBe('function');
    expect(typeof result.current.trackSubscriptionViewed).toBe('function');
    expect(typeof result.current.trackError).toBe('function');
    expect(typeof result.current.trackTiming).toBe('function');
    expect(typeof result.current.trackCustomEvent).toBe('function');
  });

  it('should provide methods that call the corresponding analytics context methods', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    
    // Test a few methods
    result.current.trackPageView('/test-page');
    expect(mockAnalyticsValue.trackPageView).toHaveBeenCalledWith('/test-page');
    
    result.current.trackSignIn('google');
    expect(mockAnalyticsValue.trackSignIn).toHaveBeenCalledWith('google');
    
    result.current.trackProjectCreated('test-project-id');
    expect(mockAnalyticsValue.trackProjectCreated).toHaveBeenCalledWith('test-project-id');
    
    result.current.trackCustomEvent('test_event', { value: 123 });
    expect(mockAnalyticsValue.trackCustomEvent).toHaveBeenCalledWith('test_event', { value: 123 });
  });
}); 