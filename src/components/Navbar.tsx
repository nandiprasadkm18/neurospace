import { motion } from 'framer-motion';
import { useMoodStore, moodColors } from '../store/moodStore';

export default function Navbar() {
  const mood = useMoodStore((s) => s.mood);
  const glowColor = moodColors[mood];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: glowColor,
            boxShadow: `0 0 12px ${glowColor}`,
            transition: 'all 0.6s ease',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--syne)',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '0.2em',
            background: `linear-gradient(90deg, ${glowColor}, #fff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.6s ease',
          }}
        >
          NEUROSCAPE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {['Features', 'Mood Engine', 'Community'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '-')}`}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            {item}
          </a>
        ))}
        <button
          className="btn-glass"
          style={{ padding: '8px 20px', fontSize: '0.75rem' }}
        >
          Launch
        </button>
      </div>
    </motion.nav>
  );
}
