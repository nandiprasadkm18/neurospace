import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Feature 1: Planet ── */
function PlanetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, 400, 400);

      // Orbit rings
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 80; r <= 160; r += 40) {
        ctx.beginPath();
        ctx.ellipse(200, 200, r, r * 0.35, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet
      const grad = ctx.createRadialGradient(200, 195, 10, 200, 200, 55);
      grad.addColorStop(0, '#7B2FFF');
      grad.addColorStop(0.6, '#4400AA');
      grad.addColorStop(1, '#1a0044');
      ctx.beginPath();
      ctx.arc(200, 200, 55, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Glow
      ctx.shadowColor = '#7B2FFF';
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(200, 200, 56, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(123, 47, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Satellites
      for (let i = 0; i < 3; i++) {
        const angle = (frame * 0.008) + (i * Math.PI * 2) / 3;
        const rx = 120;
        const ry = 42;
        const sx = 200 + Math.cos(angle) * rx;
        const sy = 200 + Math.sin(angle) * ry;
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00FFFF';
        ctx.fill();
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={400} height={400} style={{ width: '100%', maxWidth: 400 }} />;
}

/* ── Feature 2: Mood Cards ── */
const moods = [
  { name: 'CALM', color: '#4488FF', bg: 'radial-gradient(circle, rgba(68,136,255,0.2), transparent)' },
  { name: 'FOCUS', color: '#00FFFF', bg: 'linear-gradient(0deg, rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)' },
  { name: 'STRESS', color: '#FF3344', bg: 'radial-gradient(circle, rgba(255,51,68,0.15), transparent)' },
  { name: 'CREATE', color: '#FF66AA', bg: 'linear-gradient(135deg, rgba(255,0,128,0.1), rgba(0,255,128,0.1), rgba(0,128,255,0.1))' },
];

function MoodCards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 500 }}>
      {moods.map((m, i) => (
        <div
          key={m.name}
          className="mood-card"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div
            className="mood-card-inner"
            style={{
              padding: 28,
              minHeight: 140,
              backgroundImage: m.bg,
              backgroundSize: m.name === 'FOCUS' ? '30px 30px' : undefined,
              transform: hovered === i ? 'rotateX(5deg) rotateY(-5deg) scale(1.03)' : 'none',
              borderColor: hovered === i ? m.color : 'rgba(255,255,255,0.08)',
              boxShadow: hovered === i ? `0 0 40px ${m.color}33` : 'none',
            }}
          >
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: m.color,
              letterSpacing: '0.15em',
              marginBottom: 8,
            }}>
              {m.name}
            </div>
            <div style={{
              width: 30,
              height: 3,
              borderRadius: 2,
              background: m.color,
              boxShadow: `0 0 10px ${m.color}`,
              marginBottom: 12,
            }} />
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              {m.name === 'CALM' && 'Gentle waves of blue wash over your workspace.'}
              {m.name === 'FOCUS' && 'Precision grids sharpen every detail.'}
              {m.name === 'STRESS' && 'Chaos distortion reflects your energy.'}
              {m.name === 'CREATE' && 'Aurora hues ignite your imagination.'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Feature 3: AI Orb ── */
function AIOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const prompts = [
    'What do you want to build today?',
    'Let me analyze your thought patterns.',
    'Ready to map your creative flow?',
    'Your neural network is expanding.',
    'Shall we explore a new dimension?',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, 300, 300);

      const cx = 150, cy = 150, baseR = 50;
      const t = frame * 0.02;

      for (let ring = 3; ring >= 0; ring--) {
        const r = baseR + ring * 12;
        const distort = ring * 3;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.02) {
          const offset = Math.sin(a * 6 + t) * distort + Math.cos(a * 4 - t * 0.7) * distort * 0.5;
          const px = cx + Math.cos(a) * (r + offset);
          const py = cy + Math.sin(a) * (r + offset);
          a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        const alpha = 0.15 - ring * 0.03;
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(123, 47, 255, ${0.3 - ring * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Core glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 45);
      coreGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
      coreGrad.addColorStop(0.3, 'rgba(0,255,255,0.4)');
      coreGrad.addColorStop(1, 'rgba(123,47,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Typewriter for prompts
  useEffect(() => {
    let charIdx = 0;
    setDisplayText('');
    const prompt = prompts[promptIndex];
    const iv = setInterval(() => {
      charIdx++;
      setDisplayText(prompt.slice(0, charIdx));
      if (charIdx >= prompt.length) {
        clearInterval(iv);
        setTimeout(() => setPromptIndex((p) => (p + 1) % prompts.length), 2000);
      }
    }, 45);
    return () => clearInterval(iv);
  }, [promptIndex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <canvas ref={canvasRef} width={300} height={300} style={{ width: 250, height: 250 }} />
      <div style={{
        padding: '12px 24px',
        borderRadius: 12,
        border: '1px solid rgba(0,255,255,0.15)',
        background: 'rgba(0,255,255,0.04)',
        fontFamily: 'var(--mono)',
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.7)',
        minHeight: 44,
        maxWidth: 340,
        textAlign: 'center',
      }}>
        {displayText}<span style={{ opacity: 0.5, animation: 'pulseGlow 0.8s infinite' }}>|</span>
      </div>
    </div>
  );
}

/* ── Main Features Section ── */
export default function FeaturesSection() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const in1 = useInView(ref1, { once: true, margin: '-100px' });
  const in2 = useInView(ref2, { once: true, margin: '-100px' });
  const in3 = useInView(ref3, { once: true, margin: '-100px' });

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="features" style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Feature 1 */}
      <div
        ref={ref1}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
          marginBottom: 120,
        }}
      >
        <motion.div variants={fadeUp} initial="hidden" animate={in1 ? 'visible' : 'hidden'}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#00FFFF', letterSpacing: '0.2em', marginBottom: 16 }}>
            01 — VISUALIZATION
          </p>
          <h2 style={{ fontFamily: 'var(--syne)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            Your Goals,<br />
            <span style={{ background: 'linear-gradient(90deg, #00FFFF, #7B2FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Visualized as Planets
            </span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 400 }}>
            Each objective orbits your consciousness as a living celestial body. Watch tasks become satellites, deadlines become orbits.
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={in1 ? 'visible' : 'hidden'}
          transition={{ delay: 0.2 }}
        >
          <PlanetCanvas />
        </motion.div>
      </div>

      {/* Feature 2 */}
      <div
        ref={ref2}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
          marginBottom: 120,
        }}
      >
        <motion.div variants={fadeUp} initial="hidden" animate={in2 ? 'visible' : 'hidden'} style={{ order: 2 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#7B2FFF', letterSpacing: '0.2em', marginBottom: 16 }}>
            02 — EMOTION
          </p>
          <h2 style={{ fontFamily: 'var(--syne)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            Your Mood Changes<br />
            <span style={{ background: 'linear-gradient(90deg, #7B2FFF, #FF66AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              the Universe
            </span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 400 }}>
            Your emotional state reshapes the interface. Calm brings tranquility. Focus sharpens. Stress is acknowledged. Creativity flows.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate={in2 ? 'visible' : 'hidden'} style={{ order: 1 }}>
          <MoodCards />
        </motion.div>
      </div>

      {/* Feature 3 */}
      <div
        ref={ref3}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}
      >
        <motion.div variants={fadeUp} initial="hidden" animate={in3 ? 'visible' : 'hidden'}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#00FF88', letterSpacing: '0.2em', marginBottom: 16 }}>
            03 — INTELLIGENCE
          </p>
          <h2 style={{ fontFamily: 'var(--syne)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            Your AI.<br />
            <span style={{ background: 'linear-gradient(90deg, #00FF88, #00FFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Always Present.
            </span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 400 }}>
            A sentient companion that understands context, anticipates needs, and evolves with your thinking patterns.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate={in3 ? 'visible' : 'hidden'} transition={{ delay: 0.2 }}>
          <AIOrb />
        </motion.div>
      </div>
    </section>
  );
}
