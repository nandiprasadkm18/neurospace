import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore, moodColors, type Mood } from '../store/moodStore';

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mood = useMoodStore((s) => s.mood);
  const intensity = useMoodStore((s) => s.intensity);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const speed = (intensity / 50);
      const color = moodColors[mood];

      particles.forEach((p) => {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4 + (intensity / 200);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); };
  }, [mood, intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

const moodBgs: Record<Mood, string> = {
  calm: 'mood-calm',
  focus: 'mood-focus',
  stress: 'mood-stress',
  create: 'mood-create',
};

export default function EmotionWeather() {
  const { mood, setMood, intensity, setIntensity } = useMoodStore();

  const pills: Mood[] = ['calm', 'focus', 'stress', 'create'];

  return (
    <section
      id="mood-engine"
      className={moodBgs[mood]}
      style={{
        position: 'relative',
        padding: '100px 24px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'background 0.6s ease, filter 0.6s ease',
      }}
    >
      <ParticleField />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.7rem',
          color: moodColors[mood],
          letterSpacing: '0.2em',
          marginBottom: 12,
          transition: 'color 0.6s',
        }}>
          EMOTION WEATHER ENGINE
        </p>
        <h2 style={{
          fontFamily: 'var(--syne)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: 12,
          lineHeight: 1.1,
        }}>
          Feel the Interface<br />
          <span style={{
            background: `linear-gradient(90deg, ${moodColors[mood]}, #fff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.6s',
          }}>
            Respond to You
          </span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Select a mood and watch the entire universe shift around you. The interface adapts in real-time.
        </p>

        {/* Mood pills */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
          {pills.map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMood(m)}
              style={{
                padding: '12px 32px',
                borderRadius: 999,
                border: `1px solid ${mood === m ? moodColors[m] : 'rgba(255,255,255,0.1)'}`,
                background: mood === m ? `${moodColors[m]}18` : 'rgba(255,255,255,0.03)',
                color: mood === m ? moodColors[m] : 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                boxShadow: mood === m ? `0 0 20px ${moodColors[m]}33` : 'none',
              }}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {/* Intensity slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
            INTENSITY
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            style={{
              width: 200,
              accentColor: moodColors[mood],
              cursor: 'pointer',
            }}
          />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: moodColors[mood], minWidth: 36, transition: 'color 0.6s' }}>
            {intensity}%
          </span>
        </div>
      </div>
    </section>
  );
}
