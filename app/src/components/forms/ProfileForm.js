import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaSave, FaCheckCircle } from 'react-icons/fa';
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

/**
 * Profile Form Component
 * @param {Object} user - User object with name and email
 * @param {Function} onSubmit - Function to handle form submission
 * @param {Boolean} loading - Loading state for the form
 * @param {String} error - Error message from the API
 */
const ProfileForm = ({ user, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await onSubmit(formData);
      
      if (result && result.success) {
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
          <FaCheckCircle /> Your profile has been updated successfully.
        </SuccessMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <InputWrapper>
            <FaUser />
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </InputWrapper>
          {validationErrors.name && (
            <ErrorMessage>{validationErrors.name}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputWrapper>
            <FaEnvelope />
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
            />
          </InputWrapper>
          {validationErrors.email && (
            <ErrorMessage>{validationErrors.email}</ErrorMessage>
          )}
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button 
          type="submit" 
          primary 
          loading={loading}
        >
          <FaSave /> Save Changes
        </Button>
      </Form>
    </>
  );
};

export default ProfileForm; 