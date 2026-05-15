import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Preload, Html, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, GodRays, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useMoodStore, moodColors } from '../store/moodStore';
import { useDataStore, type Goal } from '../store/dataStore';

/* ── Realistic Sun ── */
const SunShader = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPos;

    void main() {
      float pulse = 0.5 + 0.5 * sin(uTime + vPos.x * 2.0);
      vec3 core = vec3(1.0, 0.4, 0.0);
      vec3 surface = vec3(1.0, 1.0, 0.5);
      float fres = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(mix(core, surface, pulse + fres) * 5.0, 1.0);
    }
  `
};

function RealisticSun({ sunRef }: { sunRef: React.RefObject<THREE.Mesh> }) {
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      (sunRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <shaderMaterial attach="material" {...SunShader} transparent />
      <pointLight intensity={100} distance={300} decay={1.5} color="#FFF5E0" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight intensity={20} color="#FF9900" />
    </mesh>
  );
}

/* ── Realistic Satellite (Moons/Spacecraft) ── */
function RealisticSatellite({ parentPos, index, total, orbitR, done }: { parentPos: THREE.Vector3, index: number, total: number, orbitR: number, done: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const [tilt] = useState(() => (Math.random() - 0.5) * 0.4);
  const [speed] = useState(() => 0.15 + Math.random() * 0.2);
  const [phase] = useState(() => (index / total) * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * orbitR;
    const z = Math.sin(t) * orbitR;
    const y = Math.sin(t) * tilt;
    ref.current.position.set(parentPos.x + x, parentPos.y + y, parentPos.z + z);
    ref.current.rotation.y += 0.01;
  });

  if (done) {
    return (
      <group ref={ref}>
        {/* Simple Spacecraft */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.04, 0.04]} />
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.01, 0.06]} />
          <meshStandardMaterial color="#3366ff" metalness={0.8} />
        </mesh>
        <pointLight intensity={0.05} color="#00ffff" distance={0.5} />
      </group>
    );
  }

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.12 + Math.random() * 0.08, 16, 16]} />
      <meshStandardMaterial color="#aaa" roughness={0.6} metalness={0.2} emissive="#444" emissiveIntensity={0.2} />
    </mesh>
  );
}

/* ── Realistic Planet ── */
function RealisticPlanet({ goal, orbitRadius, speed, onSelect, constellationPos, isConstellation, type }: { goal: Goal; orbitRadius: number; speed: number; onSelect: (g: Goal) => void; constellationPos: THREE.Vector3 | null; isConstellation: boolean; type: 'earth' | 'mars' | 'jupiter' | 'saturn' | 'neptune' }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const posRef = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState(false);

  const size = type === 'jupiter' ? 1.2 : type === 'saturn' ? 1.0 : 0.6;

  useFrame(({ clock }) => {
    if (constellationPos) {
      groupRef.current.position.lerp(constellationPos, 0.05);
    } else {
      const a = clock.getElapsedTime() * speed;
      const x = Math.cos(a) * orbitRadius;
      const z = Math.sin(a) * orbitRadius;
      const y = Math.sin(a * 0.3) * 0.3;
      groupRef.current.position.set(x, y, z);
    }
    meshRef.current.rotation.y += 0.005;
    posRef.current.copy(groupRef.current.position);
  });

  const getPlanetMaterial = () => {
    switch (type) {
      case 'earth':
        return <meshStandardMaterial color="#2255ff" roughness={0.3} metalness={0.1} emissive="#001133" emissiveIntensity={0.5} />;
      case 'mars':
        return <meshStandardMaterial color="#cc4422" roughness={0.9} emissive="#220000" emissiveIntensity={0.5} />;
      case 'jupiter':
        return <meshStandardMaterial color="#e0b080" roughness={0.9} emissive="#221100" emissiveIntensity={0.5} />;
      case 'saturn':
        return <meshStandardMaterial color="#ceb87e" roughness={0.9} emissive="#221100" emissiveIntensity={0.5} />;
      case 'neptune':
        return <meshStandardMaterial color="#4060ff" roughness={0.9} emissive="#000022" emissiveIntensity={0.5} />;
    }
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={() => onSelect(goal)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 64, 64]} />
        {getPlanetMaterial()}
      </mesh>

      {type === 'earth' && (
        <mesh scale={[1.02, 1.02, 1.02]}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial color="white" transparent opacity={0.3} />
        </mesh>
      )}

      {type === 'saturn' && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]} castShadow receiveShadow>
          <ringGeometry args={[size * 1.4, size * 2.5, 64]} />
          <meshStandardMaterial color="#a08060" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      <AnimatePresence>
        {isConstellation && hovered && (
          <Html position={[0, size + 0.5, 0]} center>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                background: 'rgba(0,0,0,0.85)',
                border: `1px solid ${goal.color}`,
                padding: '6px 12px',
                borderRadius: 4,
                color: '#fff',
                fontFamily: 'var(--mono)',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                backdropFilter: 'blur(10px)',
              }}
            >
              {goal.title}
            </motion.div>
          </Html>
        )}
      </AnimatePresence>

      {goal.tasks.map((t, i) => (
        <RealisticSatellite key={t.id} parentPos={posRef.current} index={i} total={goal.tasks.length} orbitR={size + 0.5 + i * 0.15} done={t.done} />
      ))}
    </group>
  );
}

/* ── Asteroid Belt ── */
function AsteroidBelt() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 21 + Math.random() * 4;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * 0.6;
      tempObject.position.set(x, y, z);
      tempObject.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.01 + Math.random() * 0.02;
      tempObject.scale.set(s, s, s);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    meshRef.current.rotation.y += 0.0001;
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#776655' }), count]} />
  );
}

/* ── Environment ── */
function SpaceBackground() {
  return (
    <>
      <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#5577ff" />
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial color="#050510" side={THREE.BackSide} />
      </mesh>
      {/* Milky Way Approximation */}
      <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[190, 190, 400, 32, 1, true]} />
        <meshBasicMaterial color="#1a1a3a" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

/* ── UI Components ── */
function WeatherReport() {
  const forecasts = [
    'Focus window open. Storm of creativity approaching from the west.',
    'Neural pathways clear. Ideal conditions for deep work ahead.',
    'Emotional front shifting. Gentle introspection recommended.',
    'High-pressure clarity system detected. Momentum building.',
    'Scattered idea showers throughout the afternoon. Capture everything.',
  ];
  const [idx, setIdx] = useState(0);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const iv = setInterval(() => setIdx((p) => (p + 1) % forecasts.length), 15000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(0,255,255,0.1)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', marginTop: 12 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 6 }}>NEURAL WEATHER</div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
        <span style={{ color: '#00FFFF' }}>{timeStr}</span> · {forecasts[idx]}
      </p>
    </div>
  );
}

function HUDPanel({ color }: { color: string }) {
  const { focusScore, habitsComplete, habitsTotal, energy } = useDataStore();
  const mood = useMoodStore((s) => s.mood);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { label: 'FOCUS SCORE', value: `${focusScore}% ↑`, color: '#00FFFF' },
        { label: 'HABITS', value: `${habitsComplete}/${habitsTotal} ${'●'.repeat(habitsComplete)}${'○'.repeat(habitsTotal - habitsComplete)}`, color: '#00FF88' },
        { label: 'ENERGY', value: energy, color: '#FFAA00' },
        { label: 'MOOD', value: mood.toUpperCase(), color },
      ].map((s) => (
        <div key={s.label} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontFamily: 'var(--syne)', fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
        </div>
      ))}
      <WeatherReport />
    </div>
  );
}

function GoalPanel({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'absolute', top: 80, right: 20, zIndex: 10, width: 320,
        padding: 24, borderRadius: 16, border: `1px solid ${goal.color}33`,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)',
      }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: goal.color, boxShadow: `0 0 12px ${goal.color}`, marginBottom: 12 }} />
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', marginBottom: 4, textTransform: 'uppercase' }}>{goal.category}</div>
      <h3 style={{ fontFamily: 'var(--syne)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>{goal.title}</h3>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
          <span>COMPLETION</span>
          <span style={{ color: goal.color }}>{goal.completion}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${goal.completion}%` }} style={{ height: '100%', borderRadius: 2, background: goal.color, boxShadow: `0 0 8px ${goal.color}` }} />
        </div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', marginBottom: 10 }}>TASKS</div>
      {goal.tasks.map((t) => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${t.done ? goal.color : 'rgba(255,255,255,0.15)'}`, background: t.done ? `${goal.color}22` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: goal.color }}>
            {t.done && '✓'}
          </div>
          <span style={{ fontSize: '0.8rem', color: t.done ? 'rgba(255,255,255,0.5)' : '#fff', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── 3D Scene Container ── */
function UniverseScene({ onSelectGoal, constellationMode }: { onSelectGoal: (g: Goal) => void, constellationMode: boolean }) {
  const goals = useDataStore((s) => s.goals);
  const sunRef = useRef<THREE.Mesh>(null!);
  const orbits = [8, 13, 18, 27, 35];
  const speeds = [0.1, 0.08, 0.05, 0.035, 0.025];
  const types: ('earth' | 'mars' | 'jupiter' | 'saturn' | 'neptune')[] = ['earth', 'mars', 'jupiter', 'saturn', 'neptune'];

  const constellationPositions = useMemo(() => [
    new THREE.Vector3(-12, 8, -5),
    new THREE.Vector3(12, 5, -8),
    new THREE.Vector3(0, -12, -15),
    new THREE.Vector3(-15, -5, 12),
    new THREE.Vector3(15, -2, 10),
  ], []);

  return (
    <>
      <SpaceBackground />
      <RealisticSun sunRef={sunRef} />
      <AsteroidBelt />
      
      {goals.map((g, i) => {
        const targetPos = constellationMode ? constellationPositions[i] : null;
        return (
          <group key={g.id}>
            {!constellationMode && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbits[i] - 0.05, orbits[i], 128]} />
                <meshBasicMaterial color="white" transparent opacity={0.1} side={THREE.DoubleSide} />
              </mesh>
            )}
            <RealisticPlanet
              goal={g}
              orbitRadius={orbits[i]}
              speed={constellationMode ? 0 : speeds[i]}
              onSelect={onSelectGoal}
              constellationPos={targetPos}
              isConstellation={constellationMode}
              type={types[i]}
            />
          </group>
        );
      })}
      
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={10} maxDistance={120} />
      
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.2} intensity={1.2} mipmapBlur />
        {sunRef.current && <GodRays sun={sunRef.current} samples={30} density={0.96} weight={0.3} exposure={0.5} />}
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
      </EffectComposer>
    </>
  );
}

/* ── Main Dashboard Page ── */
export default function UniverseDashboard() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [constellationMode, setConstellationMode] = useState(false);
  const { mood } = useMoodStore();
  const color = moodColors[mood];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [0, 25, 50], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, shadowMapType: THREE.PCFShadowMap }}>
        <UniverseScene onSelectGoal={setSelectedGoal} constellationMode={constellationMode} />
      </Canvas>

      {/* Side HUD */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{ position: 'absolute', top: 100, left: 30, zIndex: 10, width: 280 }}
      >
        <HUDPanel color={color} />
      </motion.div>

      {/* Constellation Toggle */}
      <button
        onClick={() => setConstellationMode(!constellationMode)}
        style={{
          position: 'absolute', bottom: 40, right: 40, zIndex: 10,
          padding: '12px 24px', borderRadius: 99,
          border: '1px solid rgba(0,255,255,0.3)',
          background: constellationMode ? 'rgba(0,255,255,0.2)' : 'rgba(0,0,0,0.6)',
          color: '#00FFFF', fontFamily: 'var(--mono)', fontSize: '0.7rem',
          cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'all 0.3s'
        }}
      >
        {constellationMode ? 'REALISTIC VIEW' : 'CONSTELLATION MODE'}
      </button>

      <AnimatePresence>
        {selectedGoal && <GoalPanel goal={selectedGoal} onClose={() => setSelectedGoal(null)} />}
      </AnimatePresence>
    </div>
  );
}
