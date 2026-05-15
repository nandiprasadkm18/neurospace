import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3-force';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillsStore, type SkillNode } from '../store/skillsStore';

function SkillNodeMesh({ node, isResonating, onClick }: { node: SkillNode & { x: number, y: number, z: number }, isResonating: boolean, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const domainColors: Record<string, string> = {
    Health: '#00FF88', Craft: '#00FFFF', Mind: '#7B2FFF', Wealth: '#FFAA00', Social: '#FF66AA', Spirit: '#FFFFFF'
  };

  const color = node.locked ? '#333' : domainColors[node.domain];

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh 
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[node.parentId ? 0.3 : 0.6, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered || isResonating ? 2 : 0.5} 
          transparent 
          opacity={node.locked ? 0.4 : 0.8}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, node.parentId ? 0.5 : 0.8, 0]}
        fontSize={0.2}
        color="#fff"
      >
        {node.name.toUpperCase()}
      </Text>

      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '8px 12px', borderRadius: 8, border: `1px solid ${color}`, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>MASTERY</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--syne)' }}>{node.mastery}%</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Connections({ nodes }: { nodes: any[] }) {
  const lineRef = useRef<THREE.Group>(null!);

  const links = useMemo(() => {
    const l: { start: [number, number, number], end: [number, number, number], id: string }[] = [];
    nodes.forEach(n => {
      if (n.parentId) {
        const parent = nodes.find(p => p.id === n.parentId);
        if (parent) {
          l.push({ start: [n.x, n.y, n.z], end: [parent.x, parent.y, parent.z], id: `${n.id}-${parent.id}` });
        }
      }
    });
    return l;
  }, [nodes]);

  return (
    <group ref={lineRef}>
      {links.map(l => (
        <Line key={l.id} start={l.start} end={l.end} />
      ))}
    </group>
  );
}

function Line({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
    </line>
  );
}

export default function NeuralSkillTreePage() {
  const { skills, level, xp } = useSkillsStore();
  const [nodes, setNodes] = useState<any[]>([]);
  const [resonatingId, setResonatingId] = useState<string | null>(null);

  useEffect(() => {
    // 3D Force Simulation
    const simulation = d3.forceSimulation(skills as any)
      .force('link', d3.forceLink().id((d: any) => d.id).distance(2))
      .force('charge', d3.forceManyBody().strength(-5))
      .force('center', d3.forceCenter(0, 0))
      .force('z', d3.forceX().strength(0.1))
      .on('tick', () => {
        setNodes([...skills.map(s => ({ ...s, x: (s as any).x || 0, y: (s as any).y || 0, z: (s as any).z || 0 }))]);
      });

    return () => simulation.stop();
  }, [skills]);

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000', position: 'relative' }}>
      
      {/* HUD Header */}
      <div style={{ position: 'absolute', top: 100, left: 40, zIndex: 10 }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>NEURAL ARCHITECT</p>
        <h1 style={{ fontFamily: 'var(--syne)', fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>LVL {level}</h1>
        <div style={{ width: 200, height: 4, background: 'rgba(255,255,255,0.1)', marginTop: 12, borderRadius: 2 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} style={{ height: '100%', background: '#00FFFF', borderRadius: 2 }} />
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: '#00FFFF', marginTop: 8 }}>+{xp} XP THIS WEEK</p>
      </div>

      <Canvas camera={{ position: [0, 0, 10] }}>
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Connections nodes={nodes} />
        {nodes.map(n => (
          <SkillNodeMesh 
            key={n.id} 
            node={n} 
            isResonating={resonatingId === n.id || (resonatingId !== null && n.parentId === resonatingId)}
            onClick={() => setResonatingId(n.id)}
          />
        ))}
      </Canvas>

      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
          CLICK NODES TO TRIGGER RESONANCE · SCROLL TO ZOOM
        </p>
      </div>
    </div>
  );
}
