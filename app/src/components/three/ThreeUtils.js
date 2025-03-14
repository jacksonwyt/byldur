import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useMemo } from 'react';
import Stats from 'three/examples/jsm/libs/stats.module';

// Custom hook for performance monitoring
export const usePerformanceMonitor = (enabled = true) => {
  const { gl } = useThree();
  
  useEffect(() => {
    if (!enabled) return;
    
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    
    // Position in top left and style
    stats.dom.style.cssText = 'position:fixed;top:0;left:0;z-index:10000;';
    
    // Setup render loop with stats
    const originalRender = gl.render;
    gl.render = function() {
      stats.begin();
      originalRender.apply(this, arguments);
      stats.end();
    };
    
    return () => {
      document.body.removeChild(stats.dom);
      gl.render = originalRender;
    };
  }, [gl, enabled]);
};

// Custom hook for responsive sizing
export const useResponsiveSize = (baseSize = 1) => {
  const { viewport } = useThree();
  const isMobile = window.innerWidth < 768;
  
  return useMemo(() => {
    const scale = isMobile ? 0.7 : 1;
    return baseSize * scale * (viewport.width / 20);
  }, [viewport.width, baseSize, isMobile]);
};

// Custom shaders
export const customShaders = {
  // Fresnel effect shader
  fresnel: {
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 2.0 },
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      uniform float time;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewPosition);
        float fresnel = fresnelBias + fresnelScale * pow(1.0 + dot(viewDirection, normal), fresnelPower);
        
        // Pulsing effect
        float pulse = sin(time * 2.0) * 0.5 + 0.5;
        fresnel *= mix(0.8, 1.2, pulse);
        
        gl_FragColor = vec4(color * fresnel, fresnel);
      }
    `
  },
  
  // Gradient shader
  gradient: {
    uniforms: {
      color1: { value: new THREE.Color(0x000000) },
      color2: { value: new THREE.Color(0xffffff) },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float time;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Animated gradient
        float noise = sin(vPosition.x * 10.0 + time) * 0.5 + 0.5;
        noise += cos(vPosition.y * 8.0 + time * 0.7) * 0.5 + 0.5;
        noise *= 0.5;
        
        vec3 color = mix(color1, color2, noise);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }
};

// Custom hook for environment map
export const useEnvironmentMap = () => {
  const { scene } = useThree();
  
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(new THREE.WebGLRenderer());
    pmremGenerator.compileEquirectangularShader();
    
    // Create simple environment map
    const envScene = new THREE.Scene();
    
    // Add gradient background
    
    const geometry = new THREE.SphereGeometry(10, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDirection = normalize(vWorldPosition);
          float y = viewDirection.y * 0.5 + 0.5;
          vec3 color = mix(vec3(0.1, 0.1, 0.1), vec3(0.3, 0.3, 0.3), y);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide
    });
    
    const envMesh = new THREE.Mesh(geometry, material);
    envScene.add(envMesh);
    
    // Generate environment map
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;
    
    return () => {
      envMap.dispose();
      pmremGenerator.dispose();
    };
  }, [scene]);
};

// Custom hook for animating shader uniforms
export const useShaderUniforms = (material, updateFunction) => {
  const materialRef = useRef(material);
  
  useFrame((state, delta) => {
    if (materialRef.current && materialRef.current.uniforms) {
      updateFunction(materialRef.current.uniforms, state, delta);
    }
  });
  
  return materialRef;
};

// Particle system component for cube corners
export const createParticleSystem = (position, color, count = 50) => {
  const particleSystem = new THREE.Group();
  
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const sizes = [];
  
  for (let i = 0; i < count; i++) {
    // Random position around the given position
    const spread = 0.5;
    const x = position.x + (Math.random() - 0.5) * spread;
    const y = position.y + (Math.random() - 0.5) * spread;
    const z = position.z + (Math.random() - 0.5) * spread;
    
    vertices.push(x, y, z);
    sizes.push(Math.random() * 0.05 + 0.02);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  const particles = new THREE.Points(geometry, material);
  particleSystem.add(particles);
  
  return particleSystem;
};

// Level of Detail (LOD) for cube
export const createLODCube = (size = 1, colors) => {
  const lod = new THREE.LOD();
  
  // High detail version
  const highDetailGeometry = new THREE.BoxGeometry(size, size, size, 16, 16, 16);
  const highDetailMaterials = colors.map(color => 
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.7,
      emissive: color,
      emissiveIntensity: 0.2
    })
  );
  const highDetailMesh = new THREE.Mesh(highDetailGeometry, highDetailMaterials);
  lod.addLevel(highDetailMesh, 0);
  
  // Medium detail version
  const medDetailGeometry = new THREE.BoxGeometry(size, size, size, 8, 8, 8);
  const medDetailMaterials = colors.map(color => 
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: 0.6,
      emissive: color,
      emissiveIntensity: 0.15
    })
  );
  const medDetailMesh = new THREE.Mesh(medDetailGeometry, medDetailMaterials);
  lod.addLevel(medDetailMesh, 10);
  
  // Low detail version
  const lowDetailGeometry = new THREE.BoxGeometry(size, size, size, 4, 4, 4);
  const lowDetailMaterials = colors.map(color => 
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.5,
      emissive: color,
      emissiveIntensity: 0.1
    })
  );
  const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterials);
  lod.addLevel(lowDetailMesh, 50);
  
  return lod;
};