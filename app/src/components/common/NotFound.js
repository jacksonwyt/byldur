import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import Button from './Button';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const ErrorIcon = styled.div`
  font-size: 6rem;
  color: var(--warning-color);
  margin-bottom: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ErrorMessage = styled.h2`
  font-size: 2rem;
  margin: 1rem 0 2rem;
`;

const ErrorDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <ErrorDescription>
        Oops! The page you're looking for doesn't exist or has been moved.
        Check the URL or navigate back to safety using the buttons below.
      </ErrorDescription>
      <ButtonContainer>
        <Button as={Link} to="/" variant="primary">
          <FaHome style={{ marginRight: '0.5rem' }} /> Go Home
        </Button>
        <Button onClick={() => window.history.back()} variant="secondary">
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Go Back
        </Button>
      </ButtonContainer>
    </NotFoundContainer>
  );
};

export default NotFound; 