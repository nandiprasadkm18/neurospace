import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, User, ArrowRight, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    playSound('click');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success
      login(data.user, data.token);
      playSound('hover'); // Success sound
      navigate('/universe'); // Redirect to dashboard

    } catch (err: any) {
      setError(err.message);
      // Play error sound if you have one, or just a click
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    playSound('hover');
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      background: '#000', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div className="noise-overlay" />
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(123,47,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(10, 10, 12, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 255, 0.15)',
          borderRadius: 24,
          padding: 40,
          boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,255,255,0.05)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--syne)', fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', marginBottom: 8 }}>
            {isLogin ? 'NEURAL SYNC' : 'INITIATE UPLINK'}
          </h2>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
            {isLogin ? 'AUTHENTICATE CONSCIOUSNESS' : 'REGISTER NEW ENTITY'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(255, 50, 50, 0.1)', border: '1px solid rgba(255,50,50,0.3)', padding: '12px 16px', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <ShieldAlert size={18} color="#ff4444" />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#ff8888' }}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: -20 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: -20 }}
                style={{ position: 'relative' }}
              >
                <User size={18} style={{ position: 'absolute', top: 14, left: 16, color: 'rgba(0,255,255,0.5)' }} />
                <input
                  type="text"
                  name="username"
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={handleInputChange}
                  required={!isLogin}
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontFamily: 'var(--mono)', fontSize: '0.8rem',
                    outline: 'none', transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: 14, left: 16, color: 'rgba(0,255,255,0.5)' }} />
            <input
              type="email"
              name="email"
              placeholder="EMAIL VECTOR"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%', padding: '14px 16px 14px 44px',
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, color: '#fff', fontFamily: 'var(--mono)', fontSize: '0.8rem',
                outline: 'none', transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: 14, left: 16, color: 'rgba(0,255,255,0.5)' }} />
            <input
              type="password"
              name="password"
              placeholder="ENCRYPTION KEY"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%', padding: '14px 16px 14px 44px',
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, color: '#fff', fontFamily: 'var(--mono)', fontSize: '0.8rem',
                outline: 'none', transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-glass"
            style={{ 
              width: '100%', 
              marginTop: 12, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 12,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'ESTABLISH LINK' : 'INITIALIZE')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
            {isLogin ? 'NO NEURAL PATTERN FOUND?' : 'ALREADY IN THE SYSTEM?'}
            <button 
              onClick={toggleMode}
              style={{ 
                background: 'none', border: 'none', color: 'var(--cyan)', 
                fontFamily: 'var(--mono)', fontSize: '0.7rem', marginLeft: 8, 
                cursor: 'pointer', textDecoration: 'underline' 
              }}
            >
              {isLogin ? 'REGISTER' : 'LOGIN'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
