import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import ColorfulCube from './components/ColorfulCube';
import EnhancedNavigation from './components/EnhancedNavigation';
import ContentPages from './components/ContentPages';
import LandingCube from './components/LandingCube';

// Styled components
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #050505;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  position: relative;
  overflow: hidden;
`;

const MainContent = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const LogoText = styled(motion.h1)`
  font-size: 7rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: -2px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 4.5rem;
  }
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(30, 30, 30, 0.3) 0%,
    rgba(5, 5, 5, 1) 70%
  );
  z-index: 1;
`;

const SearchButton = styled(motion.button)`
  position: fixed;
  top: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    width: 38px;
    height: 38px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const SoundToggle = styled(motion.button)`
  position: fixed;
  top: 30px;
  right: 90px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    top: 20px;
    right: 70px;
    width: 38px;
    height: 38px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

// Define the services with their colors
const services = [
  { name: 'Education', color: '#3498db' },
  { name: 'Write', color: '#9b59b6' },
  { name: 'Games', color: '#e74c3c' },
  { name: 'Create', color: '#2ecc71' },
  { name: 'AI', color: '#f39c12' },
  { name: 'Design', color: '#1abc9c' }
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentOpen, setContentOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeService, setActiveService] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const containerRef = useRef(null);
  
  const handleServiceClick = (index) => {
    setActiveService(services[index].name);
    setContentOpen(true);
  };
  
  const handleContentClose = () => {
    setContentOpen(false);
  };
  
  const handleCubeClick = () => {
    // Reset to home state or toggle a menu
    setContentOpen(false);
    setActiveIndex(0);
  };
  
  const handleEnterSite = () => {
    setShowLanding(false);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  return (
    <Container ref={containerRef}>
      <AnimatePresence>
        {showLanding ? (
          <LandingCube onEnterSite={handleEnterSite} key="landing-cube" />
        ) : (
          <>
            <BackgroundGradient />
            
            {/* 3D Cube at the top */}
            <ColorfulCube onClick={handleCubeClick} />
            
            {/* Main Content */}
            <MainContent
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <LogoText
                whileHover={{ scale: 1.05, textShadow: `0 0 15px ${services[activeIndex].color}` }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setContentOpen(false)}
              >
                byldur
              </LogoText>
              
              {/* Enhanced Navigation */}
              <EnhancedNavigation
                services={services}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onServiceClick={handleServiceClick}
                soundEnabled={soundEnabled}
              />
            </MainContent>
            
            {/* Content Pages */}
            <ContentPages
              isOpen={contentOpen}
              onClose={handleContentClose}
              activeService={activeService}
              services={services}
            />
            
            {/* Search Button */}
            <SearchButton
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </SearchButton>
            
            {/* Sound Toggle Button */}
            <SoundToggle
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSound}
            >
              {soundEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              )}
            </SoundToggle>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Home;