import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

const baseInputStyles = css`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid var(--border-color);
  border-radius: 0;
  font-size: 1rem;
  transition: border-color 0.15s ease;
  background-color: transparent;
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.6;
    font-style: italic;
  }
  
  ${props => props.invalid && css`
    border-color: var(--danger-color);
    
    &:focus {
      border-color: var(--danger-color);
    }
  `}
`;

const InputContainer = styled.div`
  margin-bottom: ${props => props.marginBottom || '1rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-color-secondary);
`;

const StyledInput = styled.input`
  ${baseInputStyles}
`;

const StyledTextarea = styled.textarea`
  ${baseInputStyles}
  min-height: ${props => props.minHeight || '120px'};
  resize: ${props => props.resize || 'vertical'};
`;

const StyledSelect = styled.select`
  ${baseInputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.5rem;
`;

const HelperText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${props => props.invalid ? 'var(--error-color)' : 'var(--text-color-secondary)'};
`;

/**
 * Input component that can be used for text inputs, textareas, and selects
 */
const Input = forwardRef(({
  label,
  id,
  type = 'text',
  helperText,
  invalid = false,
  fullWidth = true,
  marginBottom,
  children, // For select options
  options = [], // For select dropdowns
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const renderInputElement = () => {
    if (type === 'textarea') {
      return (
        <StyledTextarea
          id={inputId}
          ref={ref}
          invalid={invalid}
          {...props}
        />
      );
    } else if (type === 'select') {
      return (
        <StyledSelect
          id={inputId}
          ref={ref}
          invalid={invalid}
          {...props}
        >
          {children || options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
      );
    } else {
      return (
        <StyledInput
          id={inputId}
          type={type}
          ref={ref}
          invalid={invalid}
          {...props}
        />
      );
    }
  };
  
  return (
    <InputContainer marginBottom={marginBottom} fullWidth={fullWidth}>
      {label && <StyledLabel htmlFor={inputId}>{label}</StyledLabel>}
      {renderInputElement()}
      {helperText && <HelperText invalid={invalid}>{helperText}</HelperText>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;