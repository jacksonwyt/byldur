import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import * as THREE from 'three';

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
  outline: none;
  
  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
  }
`;

const AnimatedBox = animated(Box);

function AnimatedCube({ onClick }) {
  const meshRef = useRef();
  const [hoverState, setHoverState] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { mouse } = useThree(); // Get mouse position for tracking

  // Define the original cube face colors
  const colors = [
    '#3498db', // blue
    '#9b59b6', // purple
    '#e74c3c', // red
    '#2ecc71', // green
    '#f39c12', // orange
    '#1abc9c'  // teal
  ];

  // Create materials efficiently
  const materials = useMemo(() => colors.map(color => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.7,
    emissive: color,
    emissiveIntensity: 0.1,
  })), []);

  // Update emissive intensity when hovering
  useEffect(() => {
    materials.forEach(material => {
      material.emissiveIntensity = hoverState ? 0.4 : 0.1;
    });
  }, [hoverState, materials]);

  // Animation loop with mouse tracking
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!hoverState && !clicked) {
      // Add subtle mouse tracking to rotation
      meshRef.current.rotation.x += delta * 0.1 + mouse.y * 0.005;
      meshRef.current.rotation.y += delta * 0.15 + mouse.x * 0.005;
    }
    // Keep the floating motion
    meshRef.current.position.y = Math.sin(time * 0.3) * 0.05;
  });

  // Spring animations for hover effects
  const { scale, rotation } = useSpring({
    scale: hoverState ? 1.1 : 1,
    rotation: hoverState ? [0, Math.PI * 0.5, 0] : [0, 0, 0],
    config: { mass: 1.5, tension: 200, friction: 25 },
  });

  // Handle click with a delay
  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      onClick();
    }, 300);
  };

  return (
    <AnimatedBox
      ref={meshRef}
      args={[1, 1, 1]} // Cube size
      scale={scale}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHoverState(true)}
      onPointerOut={() => setHoverState(false)}
      material={materials}
    />
  );
}

const EnhancedLandingCube = ({ onEnterSite }) => {
  const wrapperRef = useRef();

  // Add keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onEnterSite();
  };

  return (
    <LandingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <CubeWrapper ref={wrapperRef}>
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