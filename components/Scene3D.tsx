import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Fix for TypeScript not recognizing R3F intrinsic elements in some environments
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      coneGeometry: any;
      octahedronGeometry: any;
      sphereGeometry: any;
      ambientLight: any;
      pointLight: any;
      fog: any;
    }
  }
}

const Tree = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 1.5, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.8} />
      </mesh>

      {/* Layers of leaves */}
      <group position={[0, 0.5, 0]}>
        {/* Bottom Layer */}
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[2.5, 2.5, 8]} />
          <meshStandardMaterial color="#14532d" roughness={0.4} />
        </mesh>

        {/* Middle Layer */}
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[2, 2, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.3} />
        </mesh>

        {/* Top Layer */}
        <mesh position={[0, 4, 0]}>
          <coneGeometry args={[1.3, 2, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.3} />
        </mesh>
      </group>

      {/* Star */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[0, 5.2, 0]}>
          <octahedronGeometry args={[0.5]} />
          <MeshDistortMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={2}
            distort={0.2}
            speed={3}
          />
        </mesh>
      </Float>

      {/* Ornaments */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 * 3; // Spiral
        const y = 1 + i * 0.25;
        const radius = 2.2 - i * 0.15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const color = i % 2 === 0 ? "#ef4444" : "#fcd34d";

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffddaa" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#aaddff" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Tree />
        </Float>

        <Sparkles
          count={50}
          scale={10}
          size={4}
          speed={0.4}
          opacity={0.5}
          color="#ffe4e6"
        />

        {/* Glow effect helper */}
        <fog attach="fog" args={["#05100a", 5, 20]} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
