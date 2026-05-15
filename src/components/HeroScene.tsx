import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Float } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      if (t < 0.5) {
        arr[i * 3] = 0; arr[i * 3 + 1] = 1; arr[i * 3 + 2] = 1;
      } else {
        arr[i * 3] = 0.48; arr[i * 3 + 1] = 0.18; arr[i * 3 + 2] = 1;
      }
    }
    return arr;
  }, [count]);

  const { size } = useThree();

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    mouseRef.current.x += (pointer.x * 0.5 - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (pointer.y * 0.3 - mouseRef.current.y) * 0.02;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.03 + mouseRef.current.x;
    mesh.current.rotation.x = mouseRef.current.y * 0.5;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function GlassSphere({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          roughness={0}
          metalness={0.2}
          transmission={0.95}
          thickness={1.5}
          color="#00FFFF"
          envMapIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

function PulsingLights() {
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1.current) light1.current.intensity = 2 + Math.sin(t * 1.5) * 1.5;
    if (light2.current) light2.current.intensity = 2 + Math.cos(t * 1.2) * 1.5;
  });

  return (
    <>
      <pointLight ref={light1} position={[5, 3, 5]} color="#00FFFF" intensity={2} distance={20} />
      <pointLight ref={light2} position={[-5, -3, -5]} color="#7B2FFF" intensity={2} distance={20} />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000', 8, 25]} />
      <ambientLight intensity={0.15} />
      <PulsingLights />
      <Particles count={2000} />
      <GlassSphere position={[-3.5, 1.5, -2]} scale={1.2} />
      <GlassSphere position={[4, -1, -3]} scale={0.8} />
      <GlassSphere position={[0, -2.5, -4]} scale={1.5} />
      <Preload all />
    </Canvas>
  );
}
