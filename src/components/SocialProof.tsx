import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const AVATAR_COLORS = [
  '#00FFFF', '#7B2FFF', '#00FF88', '#FF66AA', '#FFAA00',
  '#FF3344', '#44AAFF', '#AA44FF', '#44FFAA', '#FF4488',
];

function AvatarMarquee() {
  const avatars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
    initials: String.fromCharCode(65 + (i % 26)),
  }));

  return (
    <div style={{ overflow: 'hidden', width: '100%', padding: '20px 0' }}>
      <div className="marquee-track">
        {[...avatars, ...avatars].map((a, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${a.color}44, ${a.color})`,
              border: `2px solid ${a.color}66`,
              boxShadow: `0 0 12px ${a.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--syne)',
              fontWeight: 700,
              fontSize: '0.75rem',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {a.initials}
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    let raf: number;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, 400, 400);
      const cx = 200, cy = 200;

      if (!clicked) {
        // Pulsing orb
        const pulse = Math.sin(frame * 0.03) * 8;
        const r = 40 + pulse;
        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r + 30);
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.3, 'rgba(0,255,255,0.5)');
        grad.addColorStop(0.7, 'rgba(123,47,255,0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, r + 30, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      } else {
        // Explosion
        if (particles.length === 0) {
          for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            particles.push({
              x: cx, y: cy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color: Math.random() > 0.5 ? '#00FFFF' : '#7B2FFF',
            });
          }
        }
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.008;
          if (p.life > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        });
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [clicked]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      onClick={() => setClicked(true)}
      style={{ width: 300, height: 300, cursor: 'pointer' }}
    />
  );
}

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="community" style={{ padding: '80px 0' }}>
      {/* Social strip */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          padding: '40px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          textAlign: 'center',
        }}
      >
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.15em',
          marginBottom: 20,
        }}>
          COMMUNITY
        </p>
        <h3 style={{
          fontFamily: 'var(--syne)',
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          fontWeight: 700,
          marginBottom: 20,
        }}>
          Join{' '}
          <span style={{ color: '#00FFFF' }}>12,847</span>{' '}
          minds already exploring Neuroscape
        </h3>
        <AvatarMarquee />
      </motion.div>

      {/* Final CTA */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
        textAlign: 'center',
      }}>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: 'var(--syne)',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 40,
            background: 'linear-gradient(135deg, #fff 0%, #00FFFF 50%, #7B2FFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ENTER YOUR<br />UNIVERSE
        </motion.h2>

        <FinalOrb />

        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.15em',
          marginTop: 60,
        }}>
          © NEUROSCAPE · NEURAL OS v3.1 · ALL MINDS WELCOME
        </p>
      </div>
    </section>
  );
}
