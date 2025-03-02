import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-bg-primary);
`;

const RegisterCard = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;

  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--color-text-secondary);
  }
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
  }

  button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }

  ${({ error }) => error && `
    border-color: var(--color-error);
    &:focus {
      box-shadow: 0 0 0 2px rgba(var(--color-error-rgb), 0.1);
    }
  `}
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const PasswordRequirements = styled.div`
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
`;

const PasswordRequirement = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
  color: ${({ met }) => met ? 'var(--color-success)' : 'var(--color-text-secondary)'};

  svg {
    margin-right: 0.5rem;
    font-size: 0.85rem;
  }
`;

const ActionLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);

  a {
    color: var(--color-primary);
    margin-left: 0.25rem;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--color-primary-hover);
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Password requirements
  const requirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    match: formData.password && formData.password === formData.confirmPassword
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
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
    
    if (!validateForm()) {
      return;
    }
    
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <h2>Create Account</h2>
          <p>Join Byldur to create stunning websites</p>
        </RegisterHeader>
        
        <RegisterForm onSubmit={handleSubmit}>
          <FormGroup>
            <InputLabel htmlFor="name">Full Name</InputLabel>
            <InputWrapper>
              <FaUser />
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                error={validationErrors.name}
              />
            </InputWrapper>
            {validationErrors.name && <ErrorMessage>{validationErrors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <InputWrapper>
              <FaEnvelope />
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                error={validationErrors.email}
              />
            </InputWrapper>
            {validationErrors.email && <ErrorMessage>{validationErrors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <InputLabel htmlFor="password">Password</InputLabel>
            <InputWrapper>
              <FaLock />
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                error={validationErrors.password}
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
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <InputWrapper>
              <FaLock />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={validationErrors.confirmPassword}
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
          
          <Button 
            type="submit" 
            primary 
            fullWidth
            disabled={loading}
          >
            {loading ? <Spinner size="small" color="white" /> : 'Create Account'}
          </Button>
        </RegisterForm>
        
        <ActionLinks>
          Already have an account?<Link to="/login">Log in</Link>
        </ActionLinks>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 