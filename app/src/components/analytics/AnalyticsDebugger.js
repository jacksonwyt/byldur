import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAnalytics } from '../../hooks/useAnalytics';

const DebuggerContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 300px;
  max-height: 400px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  color: white;
  z-index: 9999;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const DebuggerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
  margin-bottom: 5px;
`;

const EventsList = styled.div`
  margin-top: 8px;
  max-height: 320px;
  overflow-y: auto;
`;

const EventItem = styled.div`
  padding: 5px;
  border-bottom: 1px solid #333;
  &:last-child {
    border-bottom: none;
  }
`;

const clearButton = {
  background: '#333',
  border: 'none',
  color: 'white',
  padding: '2px 5px',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '10px'
};

const minimizeButton = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: '16px'
};

const toggleButton = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '5px 10px',
  cursor: 'pointer',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

// Mock original console methods to capture analytics logs
const originalConsoleLog = console.log;
const captureLogs = [];

const AnalyticsDebugger = () => {
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    // Override console.log to capture analytics events
    console.log = (...args) => {
      originalConsoleLog(...args);
      
      // Check if this is an analytics log
      const logStr = args.join(' ');
      if (logStr.includes('Analytics:')) {
        const timestamp = new Date().toLocaleTimeString();
        setEvents(prev => [{ time: timestamp, message: logStr }, ...prev]);
      }
    };

    // Restore original on cleanup
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const clearEvents = () => {
    setEvents([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button style={toggleButton} onClick={toggleVisibility}>
        <span role="img" aria-label="Show Analytics">📊</span> Show Analytics Debug
      </button>
    );
  }

  return (
    <DebuggerContainer>
      <DebuggerHeader>
        <strong>Analytics Events</strong>
        <div>
          <button style={clearButton} onClick={clearEvents}>
            Clear
          </button>
          <button style={minimizeButton} onClick={toggleVisibility}>
            ▼
          </button>
        </div>
      </DebuggerHeader>
      
      <div>
        <button 
          onClick={() => analytics.trackPageView('/test-page')}
          style={{ background: '#555', border: 'none', color: 'white', padding: '3px 5px', borderRadius: '3px', marginRight: '5px', fontSize: '10px' }}
        >
          Track Page
        </button>
        <button 
          onClick={() => analytics.trackCustomEvent('test_event', 'clicked', 'test_label')}
          style={{ background: '#555', border: 'none', color: 'white', padding: '3px 5px', borderRadius: '3px', fontSize: '10px' }}
        >
          Test Event
        </button>
      </div>
      
      <EventsList>
        {events.length === 0 ? (
          <div style={{ padding: '10px 0', textAlign: 'center', color: '#999' }}>
            No events captured yet
          </div>
        ) : (
          events.map((event, index) => (
            <EventItem key={index}>
              <span style={{ color: '#999' }}>{event.time}:</span> {event.message}
            </EventItem>
          ))
        )}
      </EventsList>
    </DebuggerContainer>
  );
};

export default AnalyticsDebugger; 