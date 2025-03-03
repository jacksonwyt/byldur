import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.variant === 'success') return 'var(--success-bg-color, #f0fdf4)';
    if (props.variant === 'warning') return 'var(--warning-bg-color, #fffbeb)';
    if (props.variant === 'error') return 'var(--error-bg-color, #fef1f2)';
    if (props.variant === 'info') return 'var(--info-bg-color, #eff6ff)';
    return 'var(--info-bg-color, #eff6ff)';
  }};
  color: ${props => {
    if (props.variant === 'success') return 'var(--success-color, #16a34a)';
    if (props.variant === 'warning') return 'var(--warning-color, #d97706)';
    if (props.variant === 'error') return 'var(--error-color, #e11d48)';
    if (props.variant === 'info') return 'var(--info-color, #2563eb)';
    return 'var(--info-color, #2563eb)';
  }};
`;

/**
 * Badge component for status indicators
 * @param {string} variant - 'success', 'warning', 'error', or 'info'
 */
const Badge = ({ children, variant = 'info', ...props }) => {
  return (
    <BadgeContainer variant={variant} {...props}>
      {children}
    </BadgeContainer>
  );
};

export default Badge;