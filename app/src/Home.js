import React, { useState, useRef, Suspense } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import EnhancedNavigation from './components/EnhancedNavigation';
import ContentPages from './components/ContentPages';
// Import enhanced 3D components
import EnhancedLandingCube from './components/EnhancedLandingCube';
import EnhancedColorfulCube from './components/EnhancedColorfulCube';

// Styled components with improved aesthetics
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
  font-size: 5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: -1.5px;
  cursor: pointer;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

// Enhanced background with subtle animated gradient
const BackgroundGradient = styled(motion.div)`
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
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(40, 40, 40, 0.1) 0%,
      rgba(10, 10, 10, 0.1) 100%
    );
    opacity: 0.5;
    z-index: -1;
  }
`;

// Loading spinner for suspense fallback
const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// Define the services with their colors
const services = [
  { name: 'Education', color: '#3498db' },
  { name: 'Write', color: '#9b59b6' },
  { name: 'Games', color: '#e74c3c' },
  { name: 'Create', color: '#2ecc71' },
  { name: 'AI', color: '#f39c12' },
  { name: 'Design', color: '#1abc9c' },
  { name: 'Products', color: '#e67e22' }
];

// Main Home component with streamlined animations
const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentOpen, setContentOpen] = useState(false);
  const [soundEnabled] = useState(true);
  const [activeService, setActiveService] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const containerRef = useRef(null);
  
  // Handle service selection
  const handleServiceClick = (index) => {
    setActiveService(services[index].name);
    setContentOpen(true);
  };
  
  // Handle content close
  const handleContentClose = () => {
    setContentOpen(false);
  };
  
  // Handle cube click (home/reset)
  const handleCubeClick = () => {
    // Reset to home state
    setContentOpen(false);
    setActiveIndex(0);
  };
  
  // Handle site entry from landing
  const handleEnterSite = () => {
    setShowLanding(false);
  };
  
  return (
    <Container ref={containerRef}>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <Suspense fallback={
            <LoadingSpinner animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          }>
            <EnhancedLandingCube onEnterSite={handleEnterSite} key="landing-cube" />
          </Suspense>
        ) : (
          <>
            {/* Enhanced animated background */}
            <BackgroundGradient 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              key="background"
            />
            
            {/* Enhanced 3D Cube at the top */}
            <Suspense fallback={null}>
              <EnhancedColorfulCube onClick={handleCubeClick} />
            </Suspense>
            
            {/* Main Content with streamlined animations */}
            <MainContent
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <LogoText
                whileHover={{ 
                  scale: 1.03, 
                  textShadow: `0 0 15px ${services[activeIndex].color}`,
                  color: `${services[activeIndex].color}`
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setContentOpen(false)}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Home;