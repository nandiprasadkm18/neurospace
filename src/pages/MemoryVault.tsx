import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Text, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useDataStore, type Memory } from '../store/dataStore';

/* ── Audio Visualizer Ring ── */
function AudioVisualizer() {
  const ref = useRef<THREE.Group>(null!);
  const bars = useMemo(() => Array.from({ length: 64 }), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const s = 1 + Math.sin(t * 5 + i * 0.2) * 0.5 + Math.random() * 0.2;
      mesh.scale.y = s;
    });
    ref.current.rotation.z += 0.002;
  });

  return (
    <group ref={ref} position={[0, 0, 5.5]}>
      {bars.map((_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        const r = 4.8;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Tunnel Walls ── */
function TunnelWalls({ emotionThread }: { emotionThread: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);

  const shaderMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uEmotionThread: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv; 
      varying vec3 vPos; 
      void main() { 
        vUv = uv; 
        vPos = position; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uEmotionThread;
      varying vec2 vUv;
      varying vec3 vPos;
      void main() {
        vec2 p = vUv * 12.0;
        float hex = sin(p.x * 3.14159) * sin(p.y * 3.14159 * 1.73);
        hex = smoothstep(0.85, 0.95, abs(hex));
        float pulse = 0.5 + 0.5 * sin(uTime * 0.5 + vPos.z * 0.3);

        vec3 baseCol = vec3(0.005, 0.01, 0.03);
        vec3 glowCol = vec3(0.0, 1.0, 1.0);

        if (uEmotionThread > 0.5) {
          glowCol = mix(vec3(1.0, 0.2, 0.5), vec3(0.0, 0.5, 1.0), sin(vPos.z * 0.1 + uTime * 0.5) * 0.5 + 0.5);
        }

        vec3 col = mix(baseCol, glowCol, hex * 0.2 * pulse);
        float alpha = hex * 0.3 * pulse + 0.05;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
  }), []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.getElapsedTime();
      mat.uniforms.uEmotionThread.value = emotionThread ? 1.0 : 0.0;
    }
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[8, 8, 300, 32, 1, true]} />
      <primitive object={shaderMat} attach="material" />
    </mesh>
  );
}

/* ── Memory Card in 3D ── */
function MemoryCard3D({ memory, index, onSelect }: { memory: Memory; index: number; onSelect: (m: Memory) => void }) {
  const ref = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const z = -index * 12 - 10;
  const x = Math.sin(index * 1.5) * 3;
  const y = Math.cos(index * 1.5) * 2;
  const tilt = (Math.random() - 0.5) * 0.4;

  const emotionColors: Record<string, string> = {
    happy: '#FFAA00', calm: '#4488FF', excited: '#00FF88', reflective: '#7B2FFF', sad: '#6688AA',
  };

  useFrame(({ clock }) => {
    if (ref.current) {
      const s = hovered ? 1.2 : 1;
      ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
      ref.current.position.y += Math.sin(clock.getElapsedTime() + index) * 0.002;
    }
  });

  return (
    <group ref={ref} position={[x, y, z]} rotation={[0, tilt, 0]}>
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onSelect(memory)}
      >
        <planeGeometry args={[3.5, 2.2]} />
        <meshPhysicalMaterial
          color="#0a0a1a"
          emissive={emotionColors[memory.emotion]}
          emissiveIntensity={hovered ? 0.6 : 0.15}
          roughness={0.1}
          metalness={0.8}
          transmission={0.5}
          thickness={1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <Text position={[-1.5, 0.8, 0.05]} fontSize={0.12} color="rgba(255,255,255,0.5)" anchorX="left">
        {memory.date}
      </Text>
      
      <Text position={[-1.5, 0.3, 0.05]} fontSize={0.22} color="#ffffff" anchorX="left" maxWidth={3}>
        {memory.title}
      </Text>
      
      <Text position={[-1.5, -0.7, 0.05]} fontSize={0.12} color={emotionColors[memory.emotion]} anchorX="left">
        ● {memory.emotion.toUpperCase()}
      </Text>

      {hovered && (
        <pointLight color={emotionColors[memory.emotion]} intensity={5} distance={6} position={[0, 0, 1]} />
      )}
    </group>
  );
}

/* ── Scroll Camera ── */
function ScrollCamera() {
  const { camera } = useThree();
  const scrollPos = useRef(0);
  const targetPos = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      targetPos.current += e.deltaY * 0.015;
      targetPos.current = Math.max(0, targetPos.current);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame(() => {
    scrollPos.current += (targetPos.current - scrollPos.current) * 0.08;
    camera.position.z = 10 - scrollPos.current;
  });

  return null;
}

/* ── UI Elements ── */
function TemporalSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
        display: 'flex', gap: 12, alignItems: 'center',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 24px', borderRadius: 99,
        border: '1px solid rgba(0,255,255,0.2)',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
      }}>
        <span style={{ color: 'rgba(0,255,255,0.6)', fontSize: '0.8rem' }}>⌕</span>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
          placeholder="SEMANTIC SEARCH TIMELINE..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            fontFamily: 'var(--mono)', fontSize: '0.75rem', color: '#fff',
            width: 300, letterSpacing: '0.1em'
          }}
        />
      </div>
    </motion.div>
  );
}

function MemoryDetail({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  const emotionColors: Record<string, string> = {
    happy: '#FFAA00', calm: '#4488FF', excited: '#00FF88', reflective: '#7B2FFF', sad: '#6688AA',
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 600, padding: 48, borderRadius: 24,
          border: `1px solid ${emotionColors[memory.emotion]}44`,
          background: 'rgba(10,10,25,0.95)',
          boxShadow: `0 0 50px ${emotionColors[memory.emotion]}22`,
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: '#fff', opacity: 0.4, cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{memory.date}</div>
        <h2 style={{ fontFamily: 'var(--syne)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 20 }}>{memory.title}</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <span style={{ padding: '6px 16px', borderRadius: 99, background: `${emotionColors[memory.emotion]}22`, border: `1px solid ${emotionColors[memory.emotion]}44`, color: emotionColors[memory.emotion], fontSize: '0.7rem', fontWeight: 700 }}>
            {memory.emotion.toUpperCase()}
          </span>
        </div>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 32 }}>{memory.description}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {memory.tags.map((t) => (
            <span key={t} style={{ padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>#{t}</span>
          ))}
        </div>
        
        {/* AI Summary Section */}
        <div style={{ padding: 16, background: 'rgba(123,47,255,0.05)', borderRadius: 12, border: '1px solid rgba(123,47,255,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#B28DFF' }}>ARIA SEMANTIC ANALYSIS</span>
            <button 
              onClick={async () => {
                if (aiSummary) return;
                setLoadingSummary(true);
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch('http://localhost:5000/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ messages: [{ role: 'user', content: `Summarize this memory and extract key behavioral insights: "${memory.description}"` }] })
                  });
                  const data = await res.json();
                  setAiSummary(data.content);
                } catch (e) {
                  setAiSummary("Error generating summary.");
                }
                setLoadingSummary(false);
              }}
              style={{ background: 'none', border: '1px solid #7B2FFF', color: '#7B2FFF', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'var(--mono)' }}
            >
              {loadingSummary ? 'ANALYZING...' : 'GENERATE INSIGHT'}
            </button>
          </div>
          {aiSummary && (
            <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {aiSummary}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function MemoryVault() {
  const memories = useDataStore((s) => s.memories);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [search, setSearch] = useState('');
  const [emotionThread, setEmotionThread] = useState(false);

  const filtered = memories.filter((m) =>
    !search || m.date.includes(search) || m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 40]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 10]} intensity={2} color="#00FFFF" />
        
        <AudioVisualizer />
        <TunnelWalls emotionThread={emotionThread} />
        <ScrollCamera />
        
        {filtered.map((m, i) => (
          <MemoryCard3D key={m.id} memory={m} index={i} onSelect={setSelected} />
        ))}
        
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.3} intensity={0.8} mipmapBlur />
          <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
        </EffectComposer>
        
        <Preload all />
      </Canvas>

      <TemporalSearch onSearch={setSearch} />

      <button
        onClick={() => setEmotionThread(!emotionThread)}
        style={{
          position: 'absolute', bottom: 40, right: 40, zIndex: 10,
          padding: '14px 28px', borderRadius: 99,
          border: '1px solid rgba(0,255,255,0.3)',
          background: emotionThread ? 'rgba(0,255,255,0.2)' : 'rgba(0,0,0,0.6)',
          color: '#00FFFF', fontFamily: 'var(--mono)', fontSize: '0.75rem',
          cursor: 'pointer', backdropFilter: 'blur(20px)', transition: 'all 0.3s'
        }}
      >
        {emotionThread ? 'NEURAL THREAD: ACTIVE' : 'NEURAL THREAD: STANDBY'}
      </button>

      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none'
      }}>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}
        >
          SCROLL TO NAVIGATE TIMELINE
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <MemoryDetail memory={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
