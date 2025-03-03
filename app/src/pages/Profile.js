import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSave, FaCheckCircle } from 'react-icons/fa';
import useAuthApi from '../hooks/useAuthApi';
import { Button, Spinner } from '../components/ui';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
`;

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

const Profile = () => {
  const { user, updateProfile, changePassword, loading, error, clearError } = useAuthApi();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({
    profile: {},
    password: {}
  });
  
  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  // Clear error message when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);
  
  // Password requirements
  const requirements = {
    length: passwordData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    lowercase: /[a-z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
    special: /[^A-Za-z0-9]/.test(passwordData.newPassword),
    match: passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Clear validation error and success message
    setValidationErrors({
      ...validationErrors,
      profile: {
        ...validationErrors.profile,
        [name]: ''
      }
    });
    setProfileSuccess(false);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear validation error and success message
    setValidationErrors({
      ...validationErrors,
      password: {
        ...validationErrors.password,
        [name]: ''
      }
    });
    setPasswordSuccess(false);
  };
  
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setValidationErrors({
      ...validationErrors,
      profile: errors
    });
    
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (!requirements.length) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!(requirements.uppercase && requirements.lowercase && requirements.number)) {
      errors.newPassword = 'Password does not meet requirements';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors({
      ...validationErrors,
      password: errors
    });
    
    return Object.keys(errors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      try {
        await updateProfile(profileData);
        setProfileSuccess(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setProfileSuccess(false);
        }, 5000);
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        await changePassword(
          passwordData.currentPassword, 
          passwordData.newPassword
        );
        
        // Reset password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setPasswordSuccess(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setPasswordSuccess(false);
        }, 5000);
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };
  
  if (!user) {
    return (
      <ProfileContainer>
        <Spinner size="large" />
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <PageHeader>
        <PageTitle>Your Profile</PageTitle>
        <PageDescription>Manage your personal information and change your password</PageDescription>
      </PageHeader>
      
      <ProfileGrid>
        <ProfileCard>
          <CardTitle>
            <FaUser />
            Personal Information
          </CardTitle>
          
          {profileSuccess && (
            <SuccessMessage>
              <FaCheckCircle /> Your profile has been updated successfully.
            </SuccessMessage>
          )}
          
          <Form onSubmit={handleProfileSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <InputWrapper>
                <FaUser />
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                />
              </InputWrapper>
              {validationErrors.profile.name && (
                <ErrorMessage>{validationErrors.profile.name}</ErrorMessage>
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
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Your email address"
                />
              </InputWrapper>
              {validationErrors.profile.email && (
                <ErrorMessage>{validationErrors.profile.email}</ErrorMessage>
              )}
            </FormGroup>
            
            <Button 
              type="submit" 
              primary 
              loading={loading}
            >
              <FaSave /> Save Changes
            </Button>
          </Form>
        </ProfileCard>
        
        <ProfileCard>
          <CardTitle>
            <FaLock />
            Change Password
          </CardTitle>
          
          {passwordSuccess && (
            <SuccessMessage>
              <FaCheckCircle /> Your password has been changed successfully.
            </SuccessMessage>
          )}
          
          <Form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <InputWrapper>
                <FaLock />
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
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
              {validationErrors.password.currentPassword && (
                <ErrorMessage>{validationErrors.password.currentPassword}</ErrorMessage>
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
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
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
              {validationErrors.password.newPassword && (
                <ErrorMessage>{validationErrors.password.newPassword}</ErrorMessage>
              )}
              
              {passwordData.newPassword && (
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
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
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
              {validationErrors.password.confirmPassword && (
                <ErrorMessage>{validationErrors.password.confirmPassword}</ErrorMessage>
              )}
              {passwordData.confirmPassword && (
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
        </ProfileCard>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile; 