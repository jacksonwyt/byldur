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
  width: 120px;
  height: 120px;
  cursor: pointer;
  z-index: 100;
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    top: 15px;
  }
`;

const CubeTooltip = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: white;
  opacity: ${props => props.isHovered ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  text-align: center;
`;

// Animation for the cube faces
const AnimatedBox = animated(Box);

function AnimatedCube({ onClick, hoverState, setHoverState }) {
  const meshRef = useRef();
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

const ColorfulCube = ({ onClick }) => {
  const [hoverState, setHoverState] = useState(false);
  
  return (
    <CubeContainer>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <AnimatedCube 
          onClick={onClick} 
          hoverState={hoverState}
          setHoverState={setHoverState}
        />
      </Canvas>
      <CubeTooltip isHovered={hoverState}>
        Click to explore
      </CubeTooltip>
    </CubeContainer>
  );
};

export default ColorfulCube; 