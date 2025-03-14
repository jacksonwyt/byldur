import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LandingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: #050505;
  cursor: pointer;
`;

const CubeWrapper = styled.div`
  width: 400px;
  height: 400px;
  position: relative;
  
  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
  }
`;

// Animation for the cube faces
const AnimatedBox = animated(Box);

// Simple cube with animation
function AnimatedCube({ onClick }) {
  const meshRef = useRef();
  const [hoverState, setHoverState] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Colors for the cube faces
  const colors = [
    '#3498db', // blue 
    '#9b59b6', // purple
    '#e74c3c', // red
    '#2ecc71', // green
    '#f39c12', // orange
    '#1abc9c'  // teal
  ];
  
  // Auto rotation - toned down
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (!hoverState && !clicked) {
      // Slower rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
    
    // Less floating motion
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
  });
  
  // Animation properties - toned down
  const { scale, rotation } = useSpring({
    scale: hoverState ? 1.1 : 1,
    rotation: hoverState ? [0, Math.PI * 0.5, 0] : [0, 0, 0],
    config: { mass: 1.5, tension: 200, friction: 25 }
  });
  
  // Handle click
  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    
    // Return to normal state after animation
    setTimeout(() => {
      setClicked(false);
      onClick();
    }, 300);
  };

  return (
    <AnimatedBox
      ref={meshRef}
      args={[1, 1, 1]}
      scale={scale}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHoverState(true)}
      onPointerOut={() => setHoverState(false)}
    >
      {/* Create 6 faces with different materials */}
      {colors.map((color, index) => (
        <meshStandardMaterial
          key={index}
          attach={`material-${index}`}
          color={color}
          roughness={0.4}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={hoverState ? 0.4 : 0.1}
        />
      ))}
    </AnimatedBox>
  );
}

// Main landing cube component
const EnhancedLandingCube = ({ onEnterSite }) => {
  return (
    <LandingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <CubeWrapper>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={30} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <AnimatedCube onClick={onEnterSite} />
        </Canvas>
      </CubeWrapper>
    </LandingContainer>
  );
};

export default EnhancedLandingCube;