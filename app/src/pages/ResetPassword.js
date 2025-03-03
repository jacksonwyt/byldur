import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { Button } from '../components/ui';
import useAuthApi from '../hooks/useAuthApi';

const ResetPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 300px);
  padding: 2rem;
`;

const ResetPasswordCard = styled.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border-color);
`;

const ResetPasswordHeader = styled.div`
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

const ResetPasswordForm = styled.form`
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
  
  button {
    background: none;
    border: none;
    color: var(--text-color-secondary);
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

const InvalidTokenMessage = styled.div`
  color: var(--danger-color);
  background-color: var(--danger-color-light);
  border: 1px solid var(--danger-color);
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const PasswordRequirements = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const PasswordRequirement = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  color: ${props => props.met ? 'var(--success-color)' : 'var(--text-color-secondary)'};
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ActionLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  
  const { resetPassword, error, loading, clearError } = useAuthApi();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from the URL query parameters
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  
  useEffect(() => {
    // Clear any previous auth errors when component mounts
    clearError();
    
    // Check if token exists in URL
    if (!token) {
      setIsValidToken(false);
    }
  }, [token, clearError]);
  
  // Password requirements
  const requirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    match: formData.password && formData.password === formData.confirmPassword
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!requirements.length) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!(requirements.uppercase && requirements.lowercase && requirements.number)) {
      errors.password = 'Password does not meet requirements';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await resetPassword(token, formData.password);
        setIsSubmitted(true);
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };
  
  // If token is invalid or missing
  if (!isValidToken) {
    return (
      <ResetPasswordContainer>
        <ResetPasswordCard>
          <ResetPasswordHeader>
            <h1>Invalid Reset Link</h1>
            <p>The password reset link is invalid or has expired</p>
          </ResetPasswordHeader>
          
          <InvalidTokenMessage>
            The password reset link you followed is invalid or has expired. 
            Please request a new password reset link.
          </InvalidTokenMessage>
          
          <Button as={Link} to="/forgot-password" fullWidth>
            Request New Reset Link
          </Button>
        </ResetPasswordCard>
      </ResetPasswordContainer>
    );
  }
  
  return (
    <ResetPasswordContainer>
      <ResetPasswordCard>
        <ResetPasswordHeader>
          <h1>Reset Your Password</h1>
          <p>Please enter a new password for your account</p>
        </ResetPasswordHeader>
        
        {isSubmitted ? (
          <>
            <SuccessMessage>
              Your password has been successfully reset. You can now log in with your new password.
            </SuccessMessage>
            <Button as={Link} to="/login" fullWidth>
              Go to Login
            </Button>
          </>
        ) : (
          <ResetPasswordForm onSubmit={handleSubmit}>
            <FormGroup>
              <InputLabel htmlFor="password">New Password</InputLabel>
              <InputWrapper>
                <FaLock />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputWrapper>
              {validationErrors.password && <ErrorMessage>{validationErrors.password}</ErrorMessage>}
              
              {formData.password && (
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
              <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
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
              {validationErrors.confirmPassword && <ErrorMessage>{validationErrors.confirmPassword}</ErrorMessage>}
              {formData.confirmPassword && (
                <PasswordRequirement met={requirements.match}>
                  <FaCheckCircle /> Passwords match
                </PasswordRequirement>
              )}
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit" loading={loading} fullWidth>
              Reset Password
            </Button>
            
            <ActionLinks>
              <Link to="/login">
                <FaArrowLeft /> Back to Login
              </Link>
            </ActionLinks>
          </ResetPasswordForm>
        )}
      </ResetPasswordCard>
    </ResetPasswordContainer>
  );
};

export default ResetPassword; 