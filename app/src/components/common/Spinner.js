import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.fullScreen ? '0' : '2rem'};
  height: ${props => props.fullScreen ? '100vh' : 'auto'};
  width: ${props => props.fullScreen ? '100vw' : 'auto'};
  position: ${props => props.fullScreen ? 'fixed' : 'relative'};
  top: ${props => props.fullScreen ? '0' : 'auto'};
  left: ${props => props.fullScreen ? '0' : 'auto'};
  z-index: ${props => props.fullScreen ? '9999' : '1'};
  background-color: ${props => props.fullScreen ? 'var(--overlay-bg-color)' : 'transparent'};
`;

const SpinnerElement = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid var(--spinner-color-light);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  margin-top: 1rem;
  color: var(--text-color);
  font-size: 1rem;
`;

const Spinner = ({ 
  size, 
  message, 
  fullScreen = false 
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen}>
      <SpinnerElement size={size} />
      {message && <Message>{message}</Message>}
    </SpinnerContainer>
  );
};

export default Spinner; 