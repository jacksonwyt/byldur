import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from 'react-use-gesture';
import useSound from 'use-sound';

// Enhanced styled components with animations
const NavigationContainer = styled.div`
  position: relative;
  height: 12rem;
  overflow: visible;
  margin-left: 2rem;
  width: 450px;
  
  @media (max-width: 768px) {
    height: 8rem;
    width: 280px;
    margin-left: 1rem;
  }
`;

const ServicesList = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: ${props => props.count * 100}%;
  width: 100%;
`;

const ServiceItem = styled(motion.div)`
  font-size: 7rem;
  font-weight: 600;
  height: ${props => 100 / props.count}%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${props => props.color};
  text-transform: lowercase;
  letter-spacing: -2px;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  padding-right: 30px;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 4.5rem;
    padding-right: 25px;
  }
`;

const ItemBackground = styled(motion.div)`
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  height: 80%;
  width: 5px;
  background-color: ${props => props.color};
  border-radius: 3px;
  opacity: ${props => props.active ? 1 : 0};
  
  @media (max-width: 768px) {
    left: -15px;
    width: 3px;
  }
`;

const NavControls = styled.div`
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    bottom: -35px;
    gap: 10px;
  }
`;

const NavControl = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const BreadcrumbNav = styled.div`
  position: absolute;
  bottom: -40px;
  left: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  
  @media (max-width: 768px) {
    bottom: -35px;
    font-size: 0.8rem;
  }
`;

// Define animation variants for framer-motion
const itemVariants = {
  active: {
    opacity: 1,
    scale: 1,
    textShadow: "0 0 15px currentColor",
    transition: { duration: 0.5 }
  },
  adjacent: {
    opacity: 0.4,
    scale: 0.9,
    textShadow: "0 0 0px currentColor",
    transition: { duration: 0.3 }
  },
  distant: {
    opacity: 0.1,
    scale: 0.8,
    textShadow: "0 0 0px currentColor",
    transition: { duration: 0.3 }
  }
};

const EnhancedNavigation = ({ 
  services, 
  activeIndex, 
  setActiveIndex, 
  onServiceClick,
  soundEnabled = true
}) => {
  const containerRef = useRef(null);
  const [playHover] = useSound('/sounds/hover-sound.mp3', { volume: 0.5 });
  const [playClick] = useSound('/sounds/click-sound.mp3', { volume: 0.5 });
  
  // Handle swipe gestures
  const bindGesture = useGesture({
    onDrag: ({ direction: [dx, dy], distance }) => {
      if (distance > 50) { // Only trigger after a meaningful swipe distance
        if (dy > 0 && activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
          soundEnabled && playClick();
        } else if (dy < 0 && activeIndex < services.length - 1) {
          setActiveIndex(activeIndex + 1);
          soundEnabled && playClick();
        }
      }
    }
  });
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
          soundEnabled && playClick();
        }
      } else if (e.key === 'ArrowDown') {
        if (activeIndex < services.length - 1) {
          setActiveIndex(activeIndex + 1);
          soundEnabled && playClick();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, setActiveIndex, services.length, soundEnabled, playClick]);
  
  // Handle mouse wheel
  useEffect(() => {
    let lastWheelTime = 0;
    const throttleTime = 600;
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastWheelTime < throttleTime) {
        return;
      }
      
      if (e.deltaY > 0 && activeIndex < services.length - 1) {
        setActiveIndex(activeIndex + 1);
        soundEnabled && playClick();
        lastWheelTime = now;
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
        soundEnabled && playClick();
        lastWheelTime = now;
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeIndex, setActiveIndex, services.length, soundEnabled, playClick]);
  
  // Determine which variant to use for each item
  const getItemVariant = (index) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return "active";
    if (distance === 1) return "adjacent";
    return "distant";
  };
  
  const handleItemClick = (index) => {
    setActiveIndex(index);
    onServiceClick(index);
    soundEnabled && playClick();
  };
  
  const handleControlClick = (direction) => {
    if (direction === 'up' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (direction === 'down' && activeIndex < services.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    soundEnabled && playClick();
  };
  
  return (
    <NavigationContainer ref={containerRef} {...bindGesture()}>
      <ServicesList
        count={services.length}
        animate={{ y: `${-activeIndex * (100 / services.length)}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {services.map((service, index) => (
          <ServiceItem
            key={index}
            color={service.color}
            count={services.length}
            onClick={() => handleItemClick(index)}
            onMouseEnter={() => soundEnabled && playHover()}
            variants={itemVariants}
            initial="distant"
            animate={getItemVariant(index)}
            whileHover={{ scale: getItemVariant(index) === "active" ? 1.05 : 0.95 }}
          >
            <ItemBackground 
              color={service.color} 
              active={index === activeIndex}
              initial={{ scaleY: 0 }}
              animate={{ 
                scaleY: index === activeIndex ? 1 : 0,
                opacity: index === activeIndex ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
            />
            {service.name}
          </ServiceItem>
        ))}
      </ServicesList>
      
      <NavControls>
        <NavControl
          onClick={() => handleControlClick('up')}
          disabled={activeIndex === 0}
          whileHover={{ scale: 1.1, borderColor: 'rgba(255, 255, 255, 0.5)' }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5H7z"/>
          </svg>
        </NavControl>
        <NavControl
          onClick={() => handleControlClick('down')}
          disabled={activeIndex === services.length - 1}
          whileHover={{ scale: 1.1, borderColor: 'rgba(255, 255, 255, 0.5)' }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </NavControl>
      </NavControls>
      
      <BreadcrumbNav>
        byldur / {services[activeIndex].name.toLowerCase()}
      </BreadcrumbNav>
    </NavigationContainer>
  );
};

export default EnhancedNavigation; 