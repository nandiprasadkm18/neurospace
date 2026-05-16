import { motion } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { Activity, Target, Zap, Clock, BrainCircuit, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { goals, focusScore, focusSessions, memories } = useDataStore();
  const { user } = useAuthStore();

  const activeGoals = goals.filter(g => g.completion < 100).slice(0, 3);
  const recentActivity = memories.slice(0, 4);
  const todayFocus = focusSessions[focusSessions.length - 1]?.hours || 0;

  const getAriaDirective = () => {
    if (activeGoals.length === 0) return "Scanning for new protocols. Initialize a goal in the Universe to begin calibration.";
    
    const randomGoal = activeGoals[Math.floor(Math.random() * activeGoals.length)];
    const pendingTask = randomGoal.tasks.find(t => !t.done);
    
    if (pendingTask) {
      return `Your focus score is peaking today at ${focusScore}. I recommend prioritizing the '${pendingTask.title}' task in your ${randomGoal.title} protocol to capitalize on this neural momentum.`;
    }
    
    return `Your focus score is peaking today at ${focusScore}. All immediate tasks in your active protocols are complete. Systems stable.`;
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#000', color: '#fff', paddingTop: 80, paddingLeft: 40, paddingRight: 40 }}>
      {/* Background Grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}
      >
        <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--syne)', fontSize: '3rem', fontWeight: 800, margin: 0 }}>
              COMMAND <span style={{ color: '#00FFFF' }}>CENTER</span>
            </h1>
            <p style={{ fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.5)', marginTop: 8, letterSpacing: '0.1em' }}>
              SYSTEM STATUS: OPTIMAL // WELCOME BACK, {user?.username.toUpperCase() || 'OPERATIVE'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>NEURAL SYNC</div>
              <div style={{ fontFamily: 'var(--syne)', fontSize: '1.5rem', color: '#00FF88', fontWeight: 700 }}>98.4%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>FOCUS SCORE</div>
              <div style={{ fontFamily: 'var(--syne)', fontSize: '1.5rem', color: '#00FFFF', fontWeight: 700 }}>{focusScore}</div>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Active Goals */}
            <section style={{ background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Target size={16} /> ACTIVE PROTOCOLS
                </h2>
                <Link to="/universe" style={{ color: '#00FFFF', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  VIEW UNIVERSE <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activeGoals.map(goal => (
                  <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${goal.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${goal.color}44` }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: goal.color, boxShadow: `0 0 10px ${goal.color}` }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--syne)', fontWeight: 600, fontSize: '1.1rem' }}>{goal.title}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{goal.tasks.filter(t=>t.done).length} / {goal.tasks.length} TASKS</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--mono)', color: goal.color, fontSize: '1.2rem' }}>{goal.completion}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Link to="/workspace" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)', padding: 24, borderRadius: 16, textDecoration: 'none', color: '#fff', transition: 'all 0.3s' }}>
                <Clock color="#00FFFF" size={24} style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--syne)', margin: 0, fontSize: '1.2rem' }}>ENTER FLOW STATE</h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Launch Dream Workspace timer</p>
              </Link>
              <Link to="/ai-core" style={{ background: 'rgba(123,47,255,0.05)', border: '1px solid rgba(123,47,255,0.2)', padding: 24, borderRadius: 16, textDecoration: 'none', color: '#fff', transition: 'all 0.3s' }}>
                <BrainCircuit color="#7B2FFF" size={24} style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--syne)', margin: 0, fontSize: '1.2rem' }}>CONSULT ARIA</h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Strategic AI alignment</p>
              </Link>
            </section>
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* ARIA Recommendations */}
            <section style={{ background: 'linear-gradient(180deg, rgba(123,47,255,0.1) 0%, rgba(10,10,15,0.6) 100%)', border: '1px solid rgba(123,47,255,0.2)', borderRadius: 16, padding: 24, backdropFilter: 'blur(20px)' }}>
              <h2 style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: '#B28DFF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <BrainCircuit size={16} /> ARIA DIRECTIVE
              </h2>
              <p style={{ fontFamily: 'var(--syne)', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                "{getAriaDirective()}"
              </p>
            </section>

            {/* Recent Activity */}
            <section style={{ background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, backdropFilter: 'blur(20px)' }}>
              <h2 style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Activity size={16} /> RECENT LOGS
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {recentActivity.map(mem => (
                  <div key={mem.id} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 2, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 4, left: -3, width: 8, height: 8, borderRadius: '50%', background: '#00FFFF' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--syne)', fontSize: '0.9rem' }}>{mem.title}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{mem.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mini Stats */}
            <section style={{ background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>TODAY'S FOCUS</div>
                  <div style={{ fontFamily: 'var(--syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{todayFocus} HRS</div>
                </div>
                <Zap size={24} color="#FEBC2E" />
              </div>
            </section>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
