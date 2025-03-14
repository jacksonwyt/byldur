import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
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
  width: 300px;
  height: 300px;
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const PulseText = styled(motion.div)`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  opacity: 0.8;
  letter-spacing: 1px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    bottom: 15%;
  }
`;

// Animation for the cube faces
const AnimatedBox = animated(Box);

function AnimatedCube({ onClick }) {
  const meshRef = useRef();
  const [hoverState, setHoverState] = useState(false);
  const colors = [
    '#3498db', // blue 
    '#9b59b6', // purple
    '#e74c3c', // red
    '#2ecc71', // green
    '#f39c12', // orange
    '#1abc9c'  // teal
  ];
  
  // Auto rotation 
  useFrame((state, delta) => {
    if (!hoverState) {
      // Regular slow rotation when not hovered
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  
  // Animation properties
  const { scale, rotation } = useSpring({
    scale: hoverState ? 1.2 : 1,
    rotation: hoverState ? [0, Math.PI, 0] : [0, 0, 0],
    config: { mass: 2, tension: 300, friction: 30 }
  });

  return (
    <AnimatedBox
      ref={meshRef}
      args={[1, 1, 1]}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
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
          emissiveIntensity={hoverState ? 0.5 : 0.2}
        />
      ))}
    </AnimatedBox>
  );
}

const LandingCube = ({ onEnterSite }) => {
  return (
    <LandingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <CubeWrapper>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <AnimatedCube onClick={onEnterSite} />
        </Canvas>
      </CubeWrapper>
      
      <PulseText
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      >
        Click to enter
      </PulseText>
    </LandingContainer>
  );
};

export default LandingCube; 