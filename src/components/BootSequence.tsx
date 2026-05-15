import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';

const BOOT_LINES = [
  'NEUROSCAPE OS v3.1.0',
  'Calibrating neural interface...',
  'Mapping consciousness nodes... COMPLETE',
  'Welcome back, [USER].',
];

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'typing' | 'orb' | 'done'>('typing');
  const [charIndex, setCharIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const setIntroComplete = useMoodStore((s) => s.setIntroComplete);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return;
    if (lineIndex >= BOOT_LINES.length) {
      timerRef.current = setTimeout(() => setPhase('orb'), 1200);
      return;
    }
    const line = BOOT_LINES[lineIndex];
    if (charIndex < line.length) {
      timerRef.current = setTimeout(() => {
        setCurrentText((p) => p + line[charIndex]);
        setCharIndex((c) => c + 1);
      }, 35);
    } else {
      setVisibleLines((p) => [...p, line]);
      setCurrentText('');
      setCharIndex(0);
      setLineIndex((l) => l + 1);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, lineIndex, charIndex]);

  // Orb phase → done
  useEffect(() => {
    if (phase === 'orb') {
      const t = setTimeout(() => {
        setPhase('done');
        setIntroComplete(true);
      }, 2800);
      return () => clearTimeout(t);
    }
  }, [phase, setIntroComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="boot"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--mono)',
        }}
      >
        {phase === 'typing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              maxWidth: 600,
              width: '90%',
              fontSize: '0.9rem',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            {visibleLines.map((line, i) => (
              <div key={i} style={{ color: i === 3 ? '#00FFFF' : 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: '#00FF88', marginRight: 8 }}>{'>'}</span>
                {line}
              </div>
            ))}
            {lineIndex < BOOT_LINES.length && (
              <div>
                <span style={{ color: '#00FF88', marginRight: 8 }}>{'>'}</span>
                {currentText}
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 16,
                    background: '#00FFFF',
                    marginLeft: 2,
                    animation: 'pulseGlow 0.8s ease-in-out infinite',
                    verticalAlign: 'middle',
                  }}
                />
              </div>
            )}
          </motion.div>
        )}

        {phase === 'orb' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.4, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fff 0%, #00FFFF 40%, #7B2FFF 80%, transparent 100%)',
                boxShadow: '0 0 60px #00FFFF, 0 0 120px #7B2FFF',
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{
                fontFamily: 'var(--syne)',
                fontSize: '2.5rem',
                fontWeight: 800,
                letterSpacing: '0.3em',
                background: 'linear-gradient(90deg, #00FFFF, #7B2FFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              NEUROSCAPE
            </motion.p>
          </motion.div>
        )}

        {/* EKG Heartbeat */}
        <div className="ekg-container" style={{ position: 'absolute', bottom: 0 }}>
          <svg viewBox="0 0 600 60" preserveAspectRatio="none" style={{ width: '100%', height: 60 }}>
            <path
              className="ekg-line"
              d="M0,30 L150,30 L170,30 L185,8 L200,52 L215,30 L230,30 L450,30 L470,30 L485,8 L500,52 L515,30 L530,30 L600,30"
            />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
