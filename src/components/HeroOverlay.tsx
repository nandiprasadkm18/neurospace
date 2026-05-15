import { motion } from 'framer-motion';

const words = ['YOUR', 'MIND.', 'MAPPED.', 'ALIVE.'];

export default function HeroOverlay() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 40,
          padding: '8px 20px',
          borderRadius: 999,
          border: '1px solid rgba(0, 255, 136, 0.2)',
          background: 'rgba(0, 255, 136, 0.05)',
          fontFamily: 'var(--mono)',
          fontSize: '0.75rem',
          color: '#00FF88',
          letterSpacing: '0.1em',
          pointerEvents: 'auto',
        }}
      >
        <span className="pulse-dot" />
        NEURAL LINK ACTIVE
      </motion.div>

      {/* Headline */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px' }}>
        {words.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 60, rotateX: -40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--syne)',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: i % 2 === 0
                ? 'linear-gradient(135deg, #fff 0%, #ccc 100%)'
                : 'linear-gradient(135deg, #00FFFF 0%, #7B2FFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          fontFamily: 'var(--syne)',
          fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
          color: 'rgba(255,255,255,0.55)',
          maxWidth: 520,
          marginTop: 24,
          lineHeight: 1.6,
          fontWeight: 400,
        }}
      >
        The first platform where your thoughts become a universe.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 40,
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button className="btn-glass">Enter Neuroscape</button>
        <button className="btn-ghost">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
          Watch Intro
        </button>
      </motion.div>
    </div>
  );
}
