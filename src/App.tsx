import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore, moodColors } from './store/moodStore';
import { playSound } from './utils/soundEffects';
import BootSequence from './components/BootSequence';
import HeroOverlay from './components/HeroOverlay';
import NeuralConnector from './components/NeuralConnector';
import FeaturesSection from './components/FeaturesSection';
import EmotionWeather from './components/EmotionWeather';
import CustomCursor from './components/CustomCursor';

const HeroScene = lazy(() => import('./components/HeroScene'));
const UniverseDashboard = lazy(() => import('./pages/UniverseDashboard'));
const MemoryVault = lazy(() => import('./pages/MemoryVault'));
const NeuralAnalytics = lazy(() => import('./pages/NeuralAnalytics'));
const AICorePage = lazy(() => import('./pages/AICorePage'));
const DreamWorkspacePage = lazy(() => import('./pages/DreamWorkspacePage'));
const NeuralSkillTreePage = lazy(() => import('./pages/NeuralSkillTreePage'));

/* ── App Navbar (shared across all routes) ── */
function AppNavbar() {
  const mood = useMoodStore((s) => s.mood);
  const glowColor = moodColors[mood];
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/universe', label: 'Universe' },
    { path: '/memories', label: 'Vault' },
    { path: '/analytics', label: 'Data' },
    { path: '/ai-core', label: 'ARIA' },
    { path: '/workspace', label: 'Dream' },
    { path: '/skills', label: 'Skills' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: glowColor, boxShadow: `0 0 12px ${glowColor}`,
          transition: 'all 0.6s ease',
        }} />
        <span style={{
          fontFamily: 'var(--syne)', fontWeight: 800, fontSize: '0.9rem',
          letterSpacing: '0.2em',
          background: `linear-gradient(90deg, ${glowColor}, #fff)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          transition: 'all 0.6s ease',
        }}>
          NEUROSCAPE
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
              style={{
                fontFamily: 'var(--mono)', fontSize: '0.68rem',
                color: active ? glowColor : 'rgba(255,255,255,0.4)',
                textDecoration: 'none', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
                borderBottom: active ? `1px solid ${glowColor}` : '1px solid transparent',
                paddingBottom: 2,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* ── Landing Page ── */
function LandingPage() {
  return (
    <>
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <HeroOverlay />
      </section>
      <NeuralConnector />
      <FeaturesSection />
      <NeuralConnector />
      <EmotionWeather />
    </>
  );
}

/* ── Animated Routes ── */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Suspense fallback={
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>
              LOADING NEURAL INTERFACE...
            </div>
          </div>
        }>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/universe" element={<UniverseDashboard />} />
            <Route path="/memories" element={<MemoryVault />} />
            <Route path="/analytics" element={<NeuralAnalytics />} />
            <Route path="/ai-core" element={<AICorePage />} />
            <Route path="/workspace" element={<DreamWorkspacePage />} />
            <Route path="/skills" element={<NeuralSkillTreePage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── App ── */
function App() {
  const introComplete = useMoodStore((s) => s.introComplete);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (introComplete) {
      const t = setTimeout(() => setShowContent(true), 400);
      return () => clearTimeout(t);
    }
  }, [introComplete]);

  // Konami Code
  useEffect(() => {
    let input = '';
    const code = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
    const handler = (e: KeyboardEvent) => {
      input += e.key;
      if (input.includes(code)) {
        alert("DEEP NEURAL MODE ACTIVATED");
        document.body.style.filter = 'hue-rotate(120deg) contrast(1.5)';
        setTimeout(() => document.body.style.filter = 'none', 10000);
        input = '';
      }
      if (input.length > 100) input = '';
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <BrowserRouter>
      <CustomCursor />
      <div className="noise-overlay" />
      <BootSequence />
      {showContent && (
        <>
          <AppNavbar />
          <AnimatedRoutes />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
