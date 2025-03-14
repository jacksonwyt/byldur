import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

// Simplified physics system for interactive elements
class PhysicsSystem {
  constructor() {
    this.objects = [];
    this.gravity = new THREE.Vector3(0, -9.8, 0);
    this.friction = 0.98;
    this.elasticity = 0.7;
  }
  
  addObject(object, mass = 1, isStatic = false) {
    this.objects.push({
      object,
      mass,
      isStatic,
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      forces: new THREE.Vector3(),
      torque: new THREE.Vector3(),
      angularVelocity: new THREE.Vector3(),
    });
    return this.objects[this.objects.length - 1];
  }
  
  applyForce(objectIndex, force, point = null) {
    const obj = this.objects[objectIndex];
    if (!obj || obj.isStatic) return;
    
    obj.forces.add(force);
    
    // Apply torque if force is not at center of mass
    if (point) {
      const r = point.clone().sub(obj.object.position);
      const torque = new THREE.Vector3().crossVectors(r, force);
      obj.torque.add(torque);
    }
  }
  
  applyImpulse(objectIndex, impulse, point = null) {
    const obj = this.objects[objectIndex];
    if (!obj || obj.isStatic) return;
    
    const velocityChange = impulse.clone().divideScalar(obj.mass);
    obj.velocity.add(velocityChange);
    
    // Apply angular impulse if not at center of mass
    if (point) {
      const r = point.clone().sub(obj.object.position);
      const angularImpulse = new THREE.Vector3().crossVectors(r, impulse);
      // Simplified inertia tensor for a cube
      const inertia = obj.mass * 0.4; // Approximate
      obj.angularVelocity.add(angularImpulse.divideScalar(inertia));
    }
  }
  
  update(delta) {
    // Handle collisions first
    this._handleCollisions();
    
    // Then update physics
    for (const obj of this.objects) {
      if (obj.isStatic) continue;
      
      // Apply gravity
      obj.forces.add(this.gravity.clone().multiplyScalar(obj.mass));
      
      // Calculate acceleration
      obj.acceleration.copy(obj.forces).divideScalar(obj.mass);
      
      // Update velocity
      obj.velocity.add(obj.acceleration.clone().multiplyScalar(delta));
      
      // Apply friction
      obj.velocity.multiplyScalar(this.friction);
      
      // Update position
      obj.object.position.add(obj.velocity.clone().multiplyScalar(delta));
      
      // Update rotation from angular velocity
      const rotationDelta = obj.angularVelocity.clone().multiplyScalar(delta);
      obj.object.rotation.x += rotationDelta.x;
      obj.object.rotation.y += rotationDelta.y;
      obj.object.rotation.z += rotationDelta.z;
      
      // Apply angular friction
      obj.angularVelocity.multiplyScalar(this.friction);
      
      // Reset forces and torque for next frame
      obj.forces.set(0, 0, 0);
      obj.torque.set(0, 0, 0);
    }
  }
  
  _handleCollisions() {
    // Simplified collision detection and response
    // This is a very basic implementation that only handles sphere collisions
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const objA = this.objects[i];
        const objB = this.objects[j];
        
        // Skip if both objects are static
        if (objA.isStatic && objB.isStatic) continue;
        
        // Get bounding spheres (approximation)
        const boundingA = new THREE.Sphere(
          objA.object.position.clone(),
          objA.object.scale.x * 0.5
        );
        const boundingB = new THREE.Sphere(
          objB.object.position.clone(),
          objB.object.scale.x * 0.5
        );
        
        // Check for collision
        const distance = boundingA.center.distanceTo(boundingB.center);
        const minDistance = boundingA.radius + boundingB.radius;
        
        if (distance < minDistance) {
          // Collision detected
          const normal = new THREE.Vector3()
            .subVectors(boundingB.center, boundingA.center)
            .normalize();
          
          const relativeVelocity = new THREE.Vector3();
          if (!objA.isStatic && !objB.isStatic) {
            relativeVelocity.subVectors(objB.velocity, objA.velocity);
          } else if (objA.isStatic) {
            relativeVelocity.copy(objB.velocity).negate();
          } else {
            relativeVelocity.copy(objA.velocity);
          }
          
          const velocityAlongNormal = relativeVelocity.dot(normal);
          
          // Only resolve if objects are moving toward each other
          if (velocityAlongNormal > 0) continue;
          
          // Calculate impulse scalar
          const e = this.elasticity;
          const j = -(1 + e) * velocityAlongNormal;
          const invMassA = objA.isStatic ? 0 : 1 / objA.mass;
          const invMassB = objB.isStatic ? 0 : 1 / objB.mass;
          const impulseScalar = j / (invMassA + invMassB);
          
          // Apply impulse
          const impulse = normal.clone().multiplyScalar(impulseScalar);
          
          if (!objA.isStatic) {
            objA.velocity.sub(impulse.clone().multiplyScalar(invMassA));
          }
          
          if (!objB.isStatic) {
            objB.velocity.add(impulse.clone().multiplyScalar(invMassB));
          }
          
          // Correct position to prevent objects from sticking
          const correction = normal.clone().multiplyScalar(0.2 * (minDistance - distance) / (invMassA + invMassB));
          
          if (!objA.isStatic) {
            objA.object.position.sub(correction.clone().multiplyScalar(invMassA));
          }
          
          if (!objB.isStatic) {
            objB.object.position.add(correction.clone().multiplyScalar(invMassB));
          }
        }
      }
    }
  }
}

// React hook for using the physics system
export const usePhysics = (gravity = { x: 0, y: -9.8, z: 0 }, friction = 0.98, elasticity = 0.7) => {
  const systemRef = useRef(null);
  
  // Initialize the physics system
  useEffect(() => {
    const system = new PhysicsSystem();
    system.gravity.set(gravity.x, gravity.y, gravity.z);
    system.friction = friction;
    system.elasticity = elasticity;
    systemRef.current = system;
    
    return () => {
      // No specific cleanup needed
    };
  }, [gravity.x, gravity.y, gravity.z, friction, elasticity]);
  
  // Update physics in animation frame
  useFrame((state, delta) => {
    if (systemRef.current) {
      // Cap delta to prevent large jumps
      const cappedDelta = Math.min(delta, 0.1);
      systemRef.current.update(cappedDelta);
    }
  });
  
  // Interface for components to use
  return {
    addObject: (object, mass = 1, isStatic = false) => {
      if (!systemRef.current) return null;
      const index = systemRef.current.objects.length;
      systemRef.current.addObject(object, mass, isStatic);
      return index;
    },
    applyForce: (objectIndex, force, point = null) => {
      if (!systemRef.current) return;
      systemRef.current.applyForce(objectIndex, force, point);
    },
    applyImpulse: (objectIndex, impulse, point = null) => {
      if (!systemRef.current) return;
      systemRef.current.applyImpulse(objectIndex, impulse, point);
    }
  };
};

// Physics component for cubes with accurate collision detection
export const PhysicsCube = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  mass = 1,
  isStatic = false,
  children,
  onClick,
  onCollision,
  ...props 
}) => {
  const meshRef = useRef();
  const physicsRef = useRef();
  const { addObject, applyForce, applyImpulse } = usePhysics();
  
  // Prepare the mesh with BVH for better collision detection
  useEffect(() => {
    if (meshRef.current) {
      // Generate BVH for the geometry 
      if (meshRef.current.geometry) {
        const bvh = new MeshBVH(meshRef.current.geometry);
        meshRef.current.geometry.boundsTree = bvh;
      }
      
      // Register with physics system
      const physicsIndex = addObject(meshRef.current, mass, isStatic);
      physicsRef.current = physicsIndex;
    }
  }, [addObject, mass, isStatic]);
  
  // Expose methods to children
  const physicsApi = useMemo(() => ({
    applyForce: (force, point) => {
      if (physicsRef.current !== null) {
        applyForce(physicsRef.current, new THREE.Vector3(...force), point ? new THREE.Vector3(...point) : null);
      }
    },
    applyImpulse: (impulse, point) => {
      if (physicsRef.current !== null) {
        applyImpulse(physicsRef.current, new THREE.Vector3(...impulse), point ? new THREE.Vector3(...point) : null);
      }
    }
  }), [applyForce, applyImpulse]);
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      {children(physicsApi)}
    </mesh>
  );
};

export default usePhysics;