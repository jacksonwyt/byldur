import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 300px);
  padding: 2rem;
`;

const ForgotPasswordCard = styled.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border-color);
`;

const ForgotPasswordHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-color-secondary);
  }
`;

const ForgotPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-weight: 500;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 0 1rem;
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }
  
  svg {
    color: var(--text-color-secondary);
    margin-right: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  
  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: var(--success-color);
  background-color: var(--success-color-light);
  border: 1px solid var(--success-color);
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { requestPasswordReset, error, loading, isAuthenticated, setError } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear any previous auth errors when component mounts
    return () => setError(null);
  }, [isAuthenticated, navigate, setError]);
  
  const handleChange = (e) => {
    setEmail(e.target.value);
    setValidationError('');
  };
  
  const validateForm = () => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Email is invalid');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await requestPasswordReset(email);
        setIsSubmitted(true);
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };
  
  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <ForgotPasswordHeader>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </ForgotPasswordHeader>
        
        {isSubmitted ? (
          <>
            <SuccessMessage>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </SuccessMessage>
            <Button as={Link} to="/login" fullWidth>
              <FaArrowLeft /> Back to Login
            </Button>
          </>
        ) : (
          <ForgotPasswordForm onSubmit={handleSubmit}>
            <FormGroup>
              <InputLabel htmlFor="email">Email</InputLabel>
              <InputWrapper>
                <FaEnvelope />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </InputWrapper>
              {validationError && (
                <ErrorMessage>{validationError}</ErrorMessage>
              )}
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit" loading={loading} fullWidth>
              Send Reset Link
            </Button>
            
            <ActionLinks>
              <Link to="/login">Remember your password? Sign in</Link>
            </ActionLinks>
          </ForgotPasswordForm>
        )}
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword; 