import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { Fingerprint, Brain, Network, Zap, Target, Activity } from 'lucide-react';

export default function NeuralProfilePage() {
  const { user } = useAuthStore();
  const { goals, focusScore, energy, habitsComplete, habitsTotal, memories, focusSessions } = useDataStore();

  const habitConsistency = Math.round((habitsComplete / habitsTotal) * 100) || 0;

  const stats = useMemo(() => {
    const totalTasks = goals.reduce((acc, g) => acc + g.tasks.length, 0);
    if (totalTasks === 0) return { analytical: 50, creative: 50 };
    
    const analyticalCount = goals.filter(g => ['career', 'finance'].includes(g.category)).reduce((acc, g) => acc + g.tasks.length, 0);
    const creativeCount = goals.filter(g => ['creative', 'personal', 'health'].includes(g.category)).reduce((acc, g) => acc + g.tasks.length, 0);
    
    return {
      analytical: Math.round((analyticalCount / totalTasks) * 100),
      creative: Math.round((creativeCount / totalTasks) * 100)
    };
  }, [goals]);

  const profileInsights = useMemo(() => {
    if (memories.length === 0) return "Neuro-signature calibration in progress. Crystallize more memories to unlock behavioral intelligence.";
    
    const moods = memories.map(m => m.emotion);
    const topMood = moods.sort((a,b) => moods.filter(v => v===a).length - moods.filter(v => v===b).length).pop();
    
    return `ARIA analysis indicates a high propensity for ${topMood} states. You are actively building momentum in your ${goals[0]?.title || 'active'} protocols. System stability is currently high.`;
  }, [memories, goals]);

  const evolution = useMemo(() => {
    const totalFocus = focusSessions.reduce((acc, s) => acc + s.hours, 0);
    return [
      { title: 'Information Processing', val: `+${Math.min(memories.length * 2, 25)}%`, desc: 'Based on vault volume' },
      { title: 'Distraction Resistance', val: focusScore > 70 ? 'High' : 'Moderate', desc: `Score: ${focusScore}` },
      { title: 'Neural Plasticity', val: totalFocus > 5 ? 'Elite' : 'Active', desc: `${totalFocus.toFixed(1)} hrs logged` }
    ];
  }, [memories, focusScore, focusSessions]);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#000', color: '#fff', paddingTop: 80, paddingLeft: 40, paddingRight: 40, overflowX: 'hidden' }}>
      {/* Background Grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}
      >
        {/* Header section */}
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 40, marginBottom: 40 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,255,255,0.05)', border: '1px solid #00FFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,255,255,0.2)' }}>
            <Fingerprint size={48} color="#00FFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--mono)', color: '#00FFFF', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: 8 }}>NEURAL IDENTITY PROFILE</div>
            <h1 style={{ fontFamily: 'var(--syne)', fontSize: '3.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {user?.username.toUpperCase() || 'OPERATIVE'}
            </h1>
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 99, fontFamily: 'var(--mono)', fontSize: '0.7rem' }}>ARCHETYPE: ARCHITECT</span>
              <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 99, fontFamily: 'var(--mono)', fontSize: '0.7rem' }}>COGNITIVE STYLE: DEEP FOCUS</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          
          {/* Personality Card */}
          <section style={{ gridColumn: 'span 2', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, backdropFilter: 'blur(20px)' }}>
            <h2 style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Brain size={16} /> BEHAVIORAL INTELLIGENCE
            </h2>
            <p style={{ fontFamily: 'var(--syne)', fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
              {profileInsights}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>ANALYTICAL</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#00FFFF' }}>{stats.analytical}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}><div style={{ height: '100%', width: `${stats.analytical}%`, background: '#00FFFF', borderRadius: 2 }}/></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>CREATIVE</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#7B2FFF' }}>{stats.creative}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}><div style={{ height: '100%', width: `${stats.creative}%`, background: '#7B2FFF', borderRadius: 2 }}/></div>
              </div>
            </div>
          </section>

          {/* Core Stats Card */}
          <section style={{ background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Target size={12} /> GLOBAL FOCUS SCORE</div>
              <div style={{ fontFamily: 'var(--syne)', fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{focusScore}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={12} /> HABIT CONSISTENCY</div>
              <div style={{ fontFamily: 'var(--syne)', fontSize: '2.5rem', fontWeight: 700, color: '#00FF88' }}>{habitConsistency}%</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={12} /> CURRENT ENERGY</div>
              <div style={{ fontFamily: 'var(--syne)', fontSize: '1.5rem', fontWeight: 700, color: '#FEBC2E' }}>{energy}</div>
            </div>
          </section>

          {/* Growth Tracking */}
          <section style={{ gridColumn: 'span 3', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, backdropFilter: 'blur(20px)', marginTop: 8 }}>
            <h2 style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Network size={16} /> COGNITIVE EVOLUTION
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {evolution.map(stat => (
                <div key={stat.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 20, borderRadius: 12 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{stat.title.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--syne)', fontSize: '1.5rem', fontWeight: 700, color: '#00FFFF', marginBottom: 4 }}>{stat.val}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{stat.desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </motion.div>
    </div>
  );
}
