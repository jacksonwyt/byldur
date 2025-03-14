import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import styled from 'styled-components';

const CubeContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  cursor: pointer;
  z-index: 100;
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    top: 15px;
  }
`;

// Animation for the cube faces
const AnimatedBox = animated(Box);

// Simple animated cube with toned down animations
function AnimatedCube({ onClick, hoverState, setHoverState }) {
  const meshRef = useRef();
  
  // Define colors for the cube faces
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
    
    if (!hoverState) {
      // Slower rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
    
    // Minimal floating motion
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1) * 0.02;
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
    onClick();
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

// Main colorful cube component
const EnhancedColorfulCube = ({ onClick }) => {
  const [hoverState, setHoverState] = useState(false);
  
  return (
    <CubeContainer>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={35} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <AnimatedCube 
          onClick={onClick} 
          hoverState={hoverState}
          setHoverState={setHoverState}
        />
      </Canvas>
    </CubeContainer>
  );
};

export default EnhancedColorfulCube;