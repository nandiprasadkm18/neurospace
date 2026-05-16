import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore, moodColors } from './store/moodStore';
import { useAuthStore } from './store/authStore';
import { playSound } from './utils/soundEffects';
import BootSequence from './components/BootSequence';
import HeroOverlay from './components/HeroOverlay';
import NeuralConnector from './components/NeuralConnector';
import FeaturesSection from './components/FeaturesSection';
import EmotionWeather from './components/EmotionWeather';
import CustomCursor from './components/CustomCursor';
import GlobalTimer from './components/GlobalTimer';

const HeroScene = lazy(() => import('./components/HeroScene'));
const HomePage = lazy(() => import('./pages/HomePage'));
const UniverseDashboard = lazy(() => import('./pages/UniverseDashboard'));
const MemoryVault = lazy(() => import('./pages/MemoryVault'));
const NeuralAnalytics = lazy(() => import('./pages/NeuralAnalytics'));
const AICorePage = lazy(() => import('./pages/AICorePage'));
const DreamWorkspacePage = lazy(() => import('./pages/DreamWorkspacePage'));
const NeuralProfilePage = lazy(() => import('./pages/NeuralProfilePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

/* ── App Navbar (shared across all routes) ── */
function AppNavbar() {
  const mood = useMoodStore((s) => s.mood);
  const { isAuthenticated, user, logout } = useAuthStore();
  const glowColor = moodColors[mood];
  const location = useLocation();

  const navLinks = [
    { path: '/home', label: 'HOME' },
    { path: '/universe', label: 'UNIVERSE' },
    { path: '/memories', label: 'VAULT' },
    { path: '/analytics', label: 'DATA' },
    { path: '/ai-core', label: 'ARIA' },
    { path: '/workspace', label: 'DREAM' },
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
        {/* Auth Button & NP Link */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link 
              to="/np"
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
              style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: location.pathname === '/np' ? glowColor : 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.3s', textTransform: 'uppercase', borderBottom: location.pathname === '/np' ? `1px solid ${glowColor}` : '1px solid transparent', paddingBottom: 2 }}
            >
              {user?.username?.toUpperCase() || 'IDENTITY'}
            </Link>
            <button
              onClick={() => { playSound('click'); logout(); }}
              style={{
                background: 'transparent', border: `1px solid ${glowColor}`, borderRadius: 4,
                color: glowColor, fontFamily: 'var(--mono)', fontSize: '0.68rem', padding: '4px 8px',
                cursor: 'pointer', textTransform: 'uppercase'
              }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
            style={{
              background: `rgba(0, 255, 255, 0.1)`, border: `1px solid ${glowColor}`, borderRadius: 4,
              color: glowColor, fontFamily: 'var(--mono)', fontSize: '0.68rem', padding: '4px 12px',
              textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
              boxShadow: `0 0 10px ${glowColor}33`, transition: 'all 0.3s'
            }}
          >
            LOGIN
          </Link>
        )}
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
  const { isAuthenticated } = useAuthStore();
  
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
            <Route path="/" element={isAuthenticated ? <LandingPage /> : <Navigate to="/auth" replace />} />
            <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />} />
            <Route path="/auth" element={isAuthenticated ? <Navigate to="/universe" replace /> : <AuthPage />} />
            <Route path="/universe" element={isAuthenticated ? <UniverseDashboard /> : <Navigate to="/auth" replace />} />
            <Route path="/memories" element={isAuthenticated ? <MemoryVault /> : <Navigate to="/auth" replace />} />
            <Route path="/analytics" element={isAuthenticated ? <NeuralAnalytics /> : <Navigate to="/auth" replace />} />
            <Route path="/ai-core" element={isAuthenticated ? <AICorePage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace" element={isAuthenticated ? <DreamWorkspacePage /> : <Navigate to="/auth" replace />} />
            <Route path="/np" element={isAuthenticated ? <NeuralProfilePage /> : <Navigate to="/auth" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── App ── */
function App() {
  const introComplete = useMoodStore((s) => s.introComplete);
  const { isAuthenticated } = useAuthStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Unauthenticated users immediately see the AuthPage
      setShowContent(true);
      useMoodStore.getState().setIntroComplete(false);
    } else {
      // Authenticated users wait for the BootSequence
      if (introComplete) {
        const t = setTimeout(() => setShowContent(true), 400);
        return () => clearTimeout(t);
      } else {
        setShowContent(false);
      }
    }
  }, [isAuthenticated, introComplete]);

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
      {isAuthenticated && !introComplete && <BootSequence />}
      {showContent && (
        <>
          <GlobalTimer />
          <AppNavbar />
          <AnimatedRoutes />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
