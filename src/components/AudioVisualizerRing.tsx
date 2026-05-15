import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAIStore } from '../store/aiStore';

export default function AudioVisualizerRing() {
  const groupRef = useRef<THREE.Group>(null!);
  const { state } = useAIStore();
  
  const count = 128;
  const radius = 3.5;

  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Simulate frequency data based on state
      let height = 0.1;
      if (state === 'speaking' || state === 'listening') {
        height = 0.1 + Math.sin(t * 15 + i * 0.5) * 0.8 + Math.random() * 0.3;
      } else if (state === 'thinking') {
        height = 0.1 + Math.sin(t * 30 + i * 2.0) * 0.2;
      }

      tempObject.position.set(x, 0, z);
      tempObject.rotation.y = -angle;
      tempObject.scale.set(1, height * 2, 1);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Rotate ring slowly
    meshRef.current.rotation.y = t * 0.05;
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.CylinderGeometry(0.02, 0.02, 1, 8), new THREE.MeshBasicMaterial({ color: '#00FFFF', transparent: true, opacity: 0.6 }), count]}>
    </instancedMesh>
  );
}
