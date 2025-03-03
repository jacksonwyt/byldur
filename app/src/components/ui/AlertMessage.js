import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  
  /* Variant styling */
  ${props => props.variant === 'error' && `
    background-color: var(--error-bg-color, #fef1f2);
    color: var(--error-color, #e11d48);
    border-left-color: var(--error-color, #e11d48);
  `}
  
  ${props => props.variant === 'success' && `
    background-color: var(--success-bg-color, #f0fdf4);
    color: var(--success-color, #16a34a);
    border-left-color: var(--success-color, #16a34a);
  `}
  
  ${props => props.variant === 'warning' && `
    background-color: var(--warning-bg-color, #fffbeb);
    color: var(--warning-color, #d97706);
    border-left-color: var(--warning-color, #d97706);
  `}
  
  ${props => props.variant === 'info' && `
    background-color: var(--info-bg-color, #eff6ff);
    color: var(--info-color, #2563eb);
    border-left-color: var(--info-color, #2563eb);
  `}
`;

const AlertMessage = ({ children, variant = 'info', ...props }) => {
  if (!children) return null;
  
  return (
    <MessageContainer variant={variant} {...props}>
      {children}
    </MessageContainer>
  );
};

export default AlertMessage;