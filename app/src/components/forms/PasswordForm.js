import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaEye, FaEyeSlash, FaSave, FaCheckCircle } from 'react-icons/fa';
import Button from '../common/Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0 1rem;
  
  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
  
  svg {
    color: var(--color-text-secondary);
    margin-right: 0.5rem;
  }
  
  button {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background-color: transparent;
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    color: var(--color-text-secondary);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: var(--color-success);
  background-color: var(--color-success-bg);
  border: 1px solid var(--color-success);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const PasswordRequirements = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const PasswordRequirement = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  color: ${props => props.met ? 'var(--color-success)' : 'var(--color-text-secondary)'};
  
  svg {
    margin-right: 0.5rem;
  }
`;

/**
 * Password Form Component
 * @param {Function} onSubmit - Function to handle form submission
 * @param {Boolean} loading - Loading state for the form
 * @param {String} error - Error message from the API
 */
const PasswordForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  // Password requirements
  const requirements = {
    length: formData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(formData.newPassword),
    lowercase: /[a-z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[^A-Za-z0-9]/.test(formData.newPassword),
    match: formData.newPassword && formData.newPassword === formData.confirmPassword
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error and success message
    setValidationErrors({
      ...validationErrors,
      [name]: ''
    });
    setSuccess(false);
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (!requirements.length) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!(requirements.uppercase && requirements.lowercase && requirements.number)) {
      errors.newPassword = 'Password does not meet requirements';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (result && result.success) {
        // Reset password fields
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setSuccess(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    }
  };
  
  return (
    <>
      {success && (
        <SuccessMessage>
          <FaCheckCircle /> Your password has been changed successfully.
        </SuccessMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="currentPassword">Current Password</Label>
          <InputWrapper>
            <FaLock />
            <Input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
            />
            <button 
              type="button" 
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputWrapper>
          {validationErrors.currentPassword && (
            <ErrorMessage>{validationErrors.currentPassword}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="newPassword">New Password</Label>
          <InputWrapper>
            <FaLock />
            <Input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
            />
            <button 
              type="button" 
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputWrapper>
          {validationErrors.newPassword && (
            <ErrorMessage>{validationErrors.newPassword}</ErrorMessage>
          )}
          
          {formData.newPassword && (
            <PasswordRequirements>
              <PasswordRequirement met={requirements.length}>
                <FaCheckCircle /> At least 8 characters long
              </PasswordRequirement>
              <PasswordRequirement met={requirements.uppercase}>
                <FaCheckCircle /> At least one uppercase letter
              </PasswordRequirement>
              <PasswordRequirement met={requirements.lowercase}>
                <FaCheckCircle /> At least one lowercase letter
              </PasswordRequirement>
              <PasswordRequirement met={requirements.number}>
                <FaCheckCircle /> At least one number
              </PasswordRequirement>
              <PasswordRequirement met={requirements.special}>
                <FaCheckCircle /> At least one special character
              </PasswordRequirement>
            </PasswordRequirements>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <InputWrapper>
            <FaLock />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputWrapper>
          {validationErrors.confirmPassword && (
            <ErrorMessage>{validationErrors.confirmPassword}</ErrorMessage>
          )}
          {formData.confirmPassword && (
            <PasswordRequirement met={requirements.match}>
              <FaCheckCircle /> Passwords match
            </PasswordRequirement>
          )}
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button 
          type="submit" 
          primary 
          loading={loading}
        >
          <FaSave /> Update Password
        </Button>
      </Form>
    </>
  );
};

export default PasswordForm; 