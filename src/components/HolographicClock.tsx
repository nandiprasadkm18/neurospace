import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function HolographicClock() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Seconds orbit
    groupRef.current.children[0].position.set(Math.cos(t) * 1.5, Math.sin(t) * 1.5, 0);
    // Minutes orbit
    groupRef.current.children[1].position.set(Math.cos(t * 0.1) * 2.2, Math.sin(t * 0.1) * 2.2, 0);
    // Hours orbit
    groupRef.current.children[2].position.set(Math.cos(t * 0.01) * 3, Math.sin(t * 0.01) * 3, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Seconds */}
      <mesh>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial color="#00FFFF" />
      </mesh>
      {/* Minutes */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#7B2FFF" />
      </mesh>
      {/* Hours */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial color="#00FF88" />
      </mesh>
      
      {/* Central Star */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.8} />
      </mesh>
      
      {/* Orbit Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.48, 1.5, 64]} />
        <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.18, 2.2, 64]} />
        <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.98, 3.0, 64]} />
        <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
