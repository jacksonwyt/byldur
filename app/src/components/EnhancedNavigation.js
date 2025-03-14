import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, animate } from 'framer-motion';
import useSound from 'use-sound';

// Enhanced styled components (unchanged)
const NavigationContainer = styled.div`
  position: relative;
  height: 10rem;
  overflow: visible;
  margin-left: 1.5rem;
  width: 350px;
  
  @media (max-width: 768px) {
    height: 7rem;
    width: 250px;
    margin-left: 0.8rem;
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
  font-size: 5.5rem;
  font-weight: 600;
  height: ${props => 100 / props.count}%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${props => props.color};
  text-transform: lowercase;
  letter-spacing: -1.5px;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  padding-right: 20px;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 3.8rem;
    padding-right: 15px;
  }
`;

const NavControls = styled.div`
  position: absolute;
  bottom: -35px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    bottom: -30px;
    gap: 8px;
  }
`;

const NavControl = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 32px;
  height: 32px;
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
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

// Animation variants (unchanged)
const itemVariants = {
  active: {
    opacity: 1,
    scale: 1,
    textShadow: "0 0 6px currentColor",
    transition: { duration: 0.4 }
  },
  adjacent: {
    opacity: 0.4,
    scale: 0.95,
    textShadow: "0 0 0px currentColor",
    transition: { duration: 0.2 }
  },
  distant: {
    opacity: 0.2,
    scale: 0.9,
    textShadow: "0 0 0px currentColor",
    transition: { duration: 0.2 }
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
  const listY = useMotionValue(0); // Motion value for the list's y position
  const [containerHeight, setContainerHeight] = useState(0); // Dynamic container height

  // Set container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Sync listY with activeIndex changes (e.g., from controls or keyboard)
  useEffect(() => {
    const targetY = -activeIndex * containerHeight;
    if (listY.get() !== targetY) {
      animate(listY, targetY, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        bounce: 0.25
      });
    }
  }, [activeIndex, containerHeight, listY]);

  // Handle drag end with snapping
  const handleDragEnd = () => {
    const currentY = listY.get();
    const itemHeight = containerHeight;
    let targetIndex = Math.round(-currentY / itemHeight);
    targetIndex = Math.max(0, Math.min(targetIndex, services.length - 1));
    const targetY = -targetIndex * itemHeight;
    animate(listY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      bounce: 0.25
    });
    setActiveIndex(targetIndex);
    soundEnabled && playClick();
  };

  // Handle wheel scrolling with snapping
  useEffect(() => {
    let timeoutId;
    const minY = - (services.length - 1) * containerHeight;
    const maxY = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      const newY = Math.min(maxY, Math.max(minY, listY.get() - e.deltaY));
      listY.set(newY);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentY = listY.get();
        const itemHeight = containerHeight;
        let targetIndex = Math.round(-currentY / itemHeight);
        targetIndex = Math.max(0, Math.min(targetIndex, services.length - 1));
        const targetY = -targetIndex * itemHeight;
        animate(listY, targetY, {
          type: "spring",
          stiffness: 300,
          damping: 30,
          bounce: 0.25
        });
        setActiveIndex(targetIndex);
        soundEnabled && playClick();
      }, 150); // Snap after 150ms of inactivity
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      clearTimeout(timeoutId);
    };
  }, [containerHeight, services.length, listY, setActiveIndex, soundEnabled, playClick]);

  // Handle keyboard navigation (unchanged)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
        soundEnabled && playClick();
      } else if (e.key === 'ArrowDown' && activeIndex < services.length - 1) {
        setActiveIndex(activeIndex + 1);
        soundEnabled && playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, setActiveIndex, services.length, soundEnabled, playClick]);

  // Helper functions (unchanged)
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
    <NavigationContainer ref={containerRef}>
      <ServicesList
        count={services.length}
        style={{ y: listY }}
        drag="y"
        dragConstraints={{
          top: containerHeight ? - (services.length - 1) * containerHeight : 0,
          bottom: 0
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
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
            whileHover={{ scale: getItemVariant(index) === "active" ? 1.02 : 0.98 }}
          >
            {service.name}
          </ServiceItem>
        ))}
      </ServicesList>

      <NavControls>
        <NavControl
          onClick={() => handleControlClick('up')}
          disabled={activeIndex === 0}
          whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5H7z"/>
          </svg>
        </NavControl>
        <NavControl
          onClick={() => handleControlClick('down')}
          disabled={activeIndex === services.length - 1}
          whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </NavControl>
      </NavControls>
    </NavigationContainer>
  );
};

export default EnhancedNavigation;