import React from 'react';
import styled, { css } from 'styled-components';
import Spinner from './Spinner';

const getButtonStyles = (variant) => {
  switch(variant) {
    case 'primary':
      return css`
        background-color: var(--primary-color);
        color: var(--primary-text-color);
        border: none;
        
        &:hover {
          background-color: var(--primary-hover-color);
        }
        
        &:disabled {
          background-color: var(--disabled-color);
          color: var(--disabled-text-color);
        }
      `;
    case 'secondary':
      return css`
        background-color: var(--secondary-color);
        color: var(--secondary-text-color);
        border: none;
        
        &:hover {
          background-color: var(--secondary-hover-color);
        }
        
        &:disabled {
          background-color: var(--disabled-color);
          color: var(--disabled-text-color);
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
        
        &:hover {
          background-color: var(--primary-color-light);
        }
        
        &:disabled {
          border-color: var(--disabled-color);
          color: var(--disabled-color);
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: var(--primary-color);
        border: none;
        padding: 0.5rem 1rem;
        
        &:hover {
          text-decoration: underline;
          background-color: transparent;
        }
        
        &:disabled {
          color: var(--disabled-color);
        }
      `;
    case 'danger':
      return css`
        background-color: var(--danger-color);
        color: var(--danger-text-color);
        border: none;
        
        &:hover {
          background-color: var(--danger-hover-color);
        }
        
        &:disabled {
          background-color: var(--disabled-color);
          color: var(--disabled-text-color);
        }
      `;
    default:
      return css`
        background-color: var(--primary-color);
        color: var(--primary-text-color);
        border: none;
        
        &:hover {
          background-color: var(--primary-hover-color);
        }
        
        &:disabled {
          background-color: var(--disabled-color);
          color: var(--disabled-text-color);
        }
      `;
  }
};

const getSizeStyles = (size) => {
  switch(size) {
    case 'small':
      return css`
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
      `;
    case 'medium':
      return css`
        padding: 0.5rem 1.25rem;
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
      `;
    default:
      return css`
        padding: 0.5rem 1.25rem;
        font-size: 1rem;
      `;
  }
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  position: relative;
  overflow: hidden;
  border: none;
  outline: none;
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background-color: currentColor;
    transition: width 0.3s ease;
  }
  
  &:hover:not(:disabled):after {
    width: 100%;
  }
  
  /* Apply variant styles */
  ${props => getButtonStyles(props.variant)}
  
  /* Apply size styles */
  ${props => getSizeStyles(props.size)}
  
  /* Apply fullWidth style */
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      variant={variant}
      size={size}
      onClick={onClick}
      fullWidth={fullWidth}
      type={type}
      {...props}
    >
      {loading ? <Spinner size="20px" /> : children}
    </StyledButton>
  );
};

export default Button;