import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

// Custom chromatic aberration shader
const chromaticAberrationShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "resolution": { value: new THREE.Vector2(1, 1) },
    "rgbShift": { value: 0.003 },
    "time": { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float rgbShift;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    
    void main() {
      // Dynamic RGB shift based on time
      float shift = rgbShift * (1.0 + 0.2 * sin(time * 0.5));
      
      // Get the texture coordinates
      vec2 uv = vUv;
      
      // Calculate the direction of shift based on distance from center
      vec2 center = vec2(0.5, 0.5);
      vec2 dir = normalize(uv - center);
      float dist = length(uv - center);
      
      // Apply RGB shift
      vec4 r = texture2D(tDiffuse, uv + dir * shift * dist);
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, uv - dir * shift * dist);
      
      gl_FragColor = vec4(r.r, g.g, b.b, g.a);
    }
  `
};

// Custom vignette shader
const vignetteShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "offset": { value: 1.0 },
    "darkness": { value: 1.0 },
    "time": { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      // Get texture color
      vec4 texel = texture2D(tDiffuse, vUv);
      
      // Calculate vignette
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center) * offset;
      
      // Add pulsing effect based on time
      float pulse = sin(time * 0.5) * 0.05 + 1.0;
      dist *= pulse;
      
      // Apply vignette
      texel.rgb *= smoothstep(1.0, darkness, dist);
      
      gl_FragColor = texel;
    }
  `
};

// Main post-processing effect hook
export const usePostProcessing = (
  options = {
    bloom: true,
    bloomStrength: 0.5,
    bloomRadius: 0.3,
    bloomThreshold: 0.3,
    chromaticAberration: true,
    rgbShift: 0.003,
    vignette: true,
    vignetteDarkness: 1.8,
    vignetteOffset: 1.0,
    film: false,
    filmIntensity: 0.35,
    glitch: false,
    glitchIntensity: 1
  }
) => {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();
  const clock = useRef(new THREE.Clock());
  
  // Initialize composer on mount
  useEffect(() => {
    const pixelRatio = gl.getPixelRatio();
    
    // Create new composer
    const effectComposer = new EffectComposer(gl);
    composer.current = effectComposer;
    
    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    
    // Add bloom pass
    if (options.bloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width * pixelRatio, size.height * pixelRatio),
        options.bloomStrength,
        options.bloomRadius,
        options.bloomThreshold
      );
      effectComposer.addPass(bloomPass);
    }
    
    // Add chromatic aberration pass
    if (options.chromaticAberration) {
      const chromaticPass = new ShaderPass(chromaticAberrationShader);
      chromaticPass.uniforms.resolution.value.set(
        size.width * pixelRatio,
        size.height * pixelRatio
      );
      chromaticPass.uniforms.rgbShift.value = options.rgbShift;
      effectComposer.addPass(chromaticPass);
    }
    
    // Add vignette pass
    if (options.vignette) {
      const vignettePass = new ShaderPass(vignetteShader);
      vignettePass.uniforms.offset.value = options.vignetteOffset;
      vignettePass.uniforms.darkness.value = options.vignetteDarkness;
      effectComposer.addPass(vignettePass);
    }
    
    // Add film pass
    if (options.film) {
      const filmPass = new FilmPass(
        options.filmIntensity,
        0.5,  // noise intensity
        648,  // scanline count
        false  // grayscale
      );
      effectComposer.addPass(filmPass);
    }
    
    // Add glitch pass
    if (options.glitch) {
      const glitchPass = new GlitchPass();
      glitchPass.goWild = false;
      effectComposer.addPass(glitchPass);
    }
    
    // Ensure all passes except last have renderToScreen = false
    const passes = effectComposer.passes;
    for (let i = 0; i < passes.length; i++) {
      passes[i].renderToScreen = i === passes.length - 1;
    }
    
    return () => {
      // Dispose of resources
      composer.current.dispose();
    };
  }, [gl, scene, camera, size, options]);
  
  // Handle resize
  useEffect(() => {
    const updateSize = () => {
      const pixelRatio = gl.getPixelRatio();
      composer.current.setSize(size.width, size.height);
      composer.current.setPixelRatio(pixelRatio);
      
      // Update uniforms that depend on resolution
      composer.current.passes.forEach(pass => {
        if (pass.uniforms && pass.uniforms.resolution) {
          pass.uniforms.resolution.value.set(
            size.width * pixelRatio,
            size.height * pixelRatio
          );
        }
      });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [gl, size]);
  
  // Animation loop
  useFrame(({ gl }) => {
    if (composer.current) {
      const time = clock.current.getElapsedTime();
      
      // Update time uniforms in shader passes
      composer.current.passes.forEach(pass => {
        if (pass.uniforms && pass.uniforms.time) {
          pass.uniforms.time.value = time;
        }
      });
      
      composer.current.render();
      return true; // Skip default renderer
    }
    return false;
  }, 1);
};

// Component wrapper for post-processing
export const PostProcessingEffects = ({ children, ...options }) => {
  usePostProcessing(options);
  return <>{children}</>;
};

export default PostProcessingEffects;