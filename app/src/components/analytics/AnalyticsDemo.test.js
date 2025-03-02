import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnalyticsDemo from './AnalyticsDemo';
import { renderWithProviders } from '../../tests/test-utils';

describe('AnalyticsDemo Component', () => {
  // Mock analytics functions
  const mockAnalyticsValue = {
    trackPageView: jest.fn(),
    trackSignIn: jest.fn(),
    trackSignUp: jest.fn(),
    trackFeatureUsage: jest.fn(),
    trackProjectCreated: jest.fn(),
    trackComponentAdded: jest.fn(),
    trackSubscriptionViewed: jest.fn(),
    trackError: jest.fn(),
    trackTiming: jest.fn(),
    trackCustomEvent: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tracking buttons', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    expect(screen.getByText('Analytics Demo')).toBeInTheDocument();
    expect(screen.getByText('Track Page View')).toBeInTheDocument();
    expect(screen.getByText('Track Sign In')).toBeInTheDocument();
    expect(screen.getByText('Track Feature Usage')).toBeInTheDocument();
    expect(screen.getByText('Track Project Event')).toBeInTheDocument();
    expect(screen.getByText('Track Editor Event')).toBeInTheDocument();
    expect(screen.getByText('Track Subscription')).toBeInTheDocument();
    expect(screen.getByText('Track Error')).toBeInTheDocument();
    expect(screen.getByText('Track Timing')).toBeInTheDocument();
    expect(screen.getByText('Track Custom Event')).toBeInTheDocument();
  });

  test('calls trackPageView when Track Page View button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Page View'));
    
    expect(mockAnalyticsValue.trackPageView).toHaveBeenCalledWith('/demo-page');
  });

  test('calls trackSignIn when Track Sign In button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Sign In'));
    
    expect(mockAnalyticsValue.trackSignIn).toHaveBeenCalledWith('google');
  });

  test('calls trackFeatureUsage when Track Feature Usage button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Feature Usage'));
    
    expect(mockAnalyticsValue.trackFeatureUsage).toHaveBeenCalledWith('analytics_demo');
  });

  test('calls trackProjectCreated when Track Project Event button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Project Event'));
    
    expect(mockAnalyticsValue.trackProjectCreated).toHaveBeenCalledWith('demo-project-123');
  });

  test('calls trackComponentAdded when Track Editor Event button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Editor Event'));
    
    expect(mockAnalyticsValue.trackComponentAdded).toHaveBeenCalledWith('button', 'demo-project-123');
  });

  test('calls trackSubscriptionViewed when Track Subscription button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Subscription'));
    
    expect(mockAnalyticsValue.trackSubscriptionViewed).toHaveBeenCalledWith('premium', 'monthly');
  });

  test('calls trackError when Track Error button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Error'));
    
    expect(mockAnalyticsValue.trackError).toHaveBeenCalledWith('demo_error', 'This is a demo error');
  });

  test('calls trackTiming when Track Timing button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Timing'));
    
    expect(mockAnalyticsValue.trackTiming).toHaveBeenCalledWith('load', 1500, 'demo_page');
  });

  test('calls trackCustomEvent when Track Custom Event button is clicked', () => {
    renderWithProviders(<AnalyticsDemo />, {
      analyticsValue: mockAnalyticsValue
    });

    fireEvent.click(screen.getByText('Track Custom Event'));
    
    expect(mockAnalyticsValue.trackCustomEvent).toHaveBeenCalledWith('demo_event', {
      category: 'demo',
      label: 'test',
      value: 10
    });
  });
}); 