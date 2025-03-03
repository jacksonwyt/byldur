import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAnalytics } from '../hooks/useAnalytics';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const EventLog = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.9rem;
`;

const EventItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  &:last-child {
    border-bottom: none;
  }
`;

const AnalyticsTest = () => {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Track page view for this test page
    analytics.trackPageView('/analytics-test');
    
    // Capture console logs for demo purposes
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      
      const logStr = args.join(' ');
      if (logStr.includes('Analytics:')) {
        const timestamp = new Date().toLocaleTimeString();
        setEvents(prev => [...prev, { time: timestamp, message: logStr }]);
      }
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, [analytics]);
  
  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <Container>
      <Title>Analytics Testing Page</Title>
      <Description>
        This page allows you to test all analytics tracking events implemented in the Byldur application.
        Click on any button to trigger the corresponding analytics event and observe the logs below.
      </Description>
      
      <Section>
        <SectionTitle>Authentication Events</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => analytics.trackSignIn('email')}>Track Sign In</Button>
          <Button onClick={() => analytics.trackSignUp('email')}>Track Sign Up</Button>
          <Button onClick={() => analytics.trackSignOut()}>Track Sign Out</Button>
          <Button onClick={() => analytics.trackPasswordReset()}>Track Password Reset</Button>
        </ButtonGrid>
      </Section>
      
      <Section>
        <SectionTitle>Project Events</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => analytics.trackProjectCreated('test-project-id')}>Project Created</Button>
          <Button onClick={() => analytics.trackProjectUpdated('test-project-id')}>Project Updated</Button>
          <Button onClick={() => analytics.trackProjectPublished('test-project-id')}>Project Published</Button>
          <Button onClick={() => analytics.trackProjectDeleted('test-project-id')}>Project Deleted</Button>
          <Button onClick={() => analytics.trackProjectDuplicated('test-project-id')}>Project Duplicated</Button>
        </ButtonGrid>
      </Section>
      
      <Section>
        <SectionTitle>Editor Events</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => analytics.trackEditorOpened('test-project-id')}>Editor Opened</Button>
          <Button onClick={() => analytics.trackComponentAdded('button')}>Add Component</Button>
          <Button onClick={() => analytics.trackStyleChanged()}>Style Changed</Button>
          <Button onClick={() => analytics.trackContentSaved()}>Content Saved</Button>
          <Button onClick={() => analytics.trackAIPromptSent()}>AI Prompt Sent</Button>
        </ButtonGrid>
      </Section>
      
      <Section>
        <SectionTitle>Subscription Events</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => analytics.trackSubscriptionViewed()}>View Plans</Button>
          <Button onClick={() => analytics.trackSubscriptionStarted('premium')}>Start Subscription</Button>
          <Button onClick={() => analytics.trackSubscriptionChanged('basic')}>Change Plan</Button>
          <Button onClick={() => analytics.trackSubscriptionCancelled('premium')}>Cancel Subscription</Button>
          <Button onClick={() => analytics.trackPaymentFailed()}>Payment Failed</Button>
        </ButtonGrid>
      </Section>
      
      <Section>
        <SectionTitle>Error & Performance Events</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => analytics.trackError('api_error', 'Failed to load data')}>Track Error</Button>
          <Button onClick={() => analytics.trackTiming('page_load', 'analytics_test', 1200)}>Track Timing</Button>
          <Button onClick={() => analytics.trackCustomEvent('test_category', 'test_action', 'test_label')}>Custom Event</Button>
        </ButtonGrid>
      </Section>
      
      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionTitle>Event Log</SectionTitle>
          <Button variant="secondary" size="small" onClick={clearEvents}>Clear Log</Button>
        </div>
        <EventLog>
          {events.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6c757d' }}>
              No events logged yet. Click on any button above to trigger an event.
            </div>
          ) : (
            events.map((event, index) => (
              <EventItem key={index}>
                <span style={{ color: '#6c757d' }}>{event.time}:</span> {event.message}
              </EventItem>
            ))
          )}
        </EventLog>
      </Section>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </Container>
  );
};

export default AnalyticsTest; 