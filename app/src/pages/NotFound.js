import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import Button from '../components/common/Button';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: var(--color-bg-primary);
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  line-height: 1;
  
  @media (max-width: 576px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0.5rem 0 1.5rem;
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 0 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const NotFound = () => {
  // If the user came from a specific page, we can get the referrer
  const referrer = document.referrer;
  const hasReferrer = referrer && referrer.includes(window.location.origin);
  
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you're looking for doesn't exist or has been moved. 
        Please check the URL or navigate back to the home page.
      </Description>
      
      <ButtonContainer>
        {hasReferrer && (
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            <FaArrowLeft /> Go Back
          </Button>
        )}
        
        <Link to="/">
          <Button primary>
            <FaHome /> Return Home
          </Button>
        </Link>
      </ButtonContainer>
    </NotFoundContainer>
  );
};

export default NotFound; 