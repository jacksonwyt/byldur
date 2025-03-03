import React, { Component } from 'react';
import { AlertMessage } from '../ui';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  text-align: center;
`;

const ErrorHeading = styled.h2`
  margin-bottom: 1rem;
  color: var(--error-color);
`;

/**
 * ErrorBoundary component for catching and displaying errors
 * Usage: Wrap components that might throw errors
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    this.setState({ errorInfo });
    
    // Report to error tracking service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    const { fallback, children } = this.props;
    
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return fallback(this.state.error, this.state.errorInfo);
      }
      
      // Default fallback UI
      return (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <AlertMessage variant="error">
            {this.props.message || 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
          </AlertMessage>
          
          {this.props.showReset !== false && (
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                if (this.props.onReset) {
                  this.props.onReset();
                }
              }}
              style={{ 
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'var(--primary-color)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          )}
          
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
                <pre style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '300px'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}
        </ErrorContainer>
      );
    }

    return children;
  }
}

export default ErrorBoundary;