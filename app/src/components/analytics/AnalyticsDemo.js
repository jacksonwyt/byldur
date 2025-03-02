import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

/**
 * Demo component showcasing how to use the analytics hook
 * This is for demonstration purposes only and should be removed in production
 */
const AnalyticsDemo = () => {
  const analytics = useAnalytics();

  const handleTrackPageView = () => {
    analytics.trackPageView('/demo-page');
  };

  const handleTrackSignIn = () => {
    analytics.trackSignIn('google');
  };

  const handleTrackFeatureUsage = () => {
    analytics.trackFeatureUsage('analytics_demo');
  };

  const handleTrackProjectEvent = () => {
    analytics.trackProjectCreated('demo-project-123');
  };

  const handleTrackEditorEvent = () => {
    analytics.trackComponentAdded('button', 'demo-project-123');
  };

  const handleTrackSubscriptionEvent = () => {
    analytics.trackSubscriptionViewed('premium', 'monthly');
  };

  const handleTrackError = () => {
    analytics.trackError('demo_error', 'This is a demo error');
  };

  const handleTrackTiming = () => {
    analytics.trackTiming('load', 1500, 'demo_page');
  };

  const handleTrackCustomEvent = () => {
    analytics.trackCustomEvent('demo_event', {
      category: 'demo',
      label: 'test',
      value: 10
    });
  };

  return (
    <div className="analytics-demo p-4 border rounded shadow-sm mb-4">
      <h2 className="text-xl font-bold mb-3">Analytics Demo</h2>
      <p className="mb-3 text-sm text-gray-600">Click the buttons to trigger different analytics events</p>
      
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <button 
          onClick={handleTrackPageView} 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Track Page View
        </button>
        
        <button 
          onClick={handleTrackSignIn}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Track Sign In
        </button>
        
        <button 
          onClick={handleTrackFeatureUsage}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Track Feature Usage
        </button>
        
        <button 
          onClick={handleTrackProjectEvent}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Track Project Event
        </button>
        
        <button 
          onClick={handleTrackEditorEvent}
          className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
        >
          Track Editor Event
        </button>
        
        <button 
          onClick={handleTrackSubscriptionEvent}
          className="bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
        >
          Track Subscription
        </button>
        
        <button 
          onClick={handleTrackError}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Track Error
        </button>
        
        <button 
          onClick={handleTrackTiming}
          className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
        >
          Track Timing
        </button>
        
        <button 
          onClick={handleTrackCustomEvent}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Track Custom Event
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: This component is for demonstration purposes only and should be removed in production.</p>
        <p>Open your browser console to see the tracking events being logged.</p>
      </div>
    </div>
  );
};

export default AnalyticsDemo; 