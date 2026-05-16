import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { useMoodStore, moodColors } from '../store/moodStore';

/* ── Productivity Pulse (Line Chart) ── */
function ProductivityPulse() {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true });
  const { focusSessions } = useDataStore();
  const data = useMemo(() => {
    if (focusSessions.length === 0) return [0, 0, 0, 0, 0, 0, 0]; 
    return focusSessions.map(s => Math.min((s.hours / 2) * 100, 100));
  }, [focusSessions]);
  const w = 800, h = 200, pad = 20;

  const pathD = useMemo(() => {
    if (data.length < 2) {
      const y = h - pad - ((data[0] || 0 - 30) / 70) * (h - pad * 2);
      return `M${pad},${y} L${w - pad},${y}`;
    }
    const pts = data.map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - 30) / 70) * (h - pad * 2);
      return `${x},${y}`;
    });
    return `M${pts.join(' L')}`;
  }, [data]);

  const areaD = useMemo(() => {
    if (data.length < 2) {
      const y = h - pad - ((data[0] || 0 - 30) / 70) * (h - pad * 2);
      return `M${pad},${h - pad} L${pad},${y} L${w - pad},${y} L${w - pad},${h - pad} Z`;
    }
    const pts = data.map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - 30) / 70) * (h - pad * 2);
      return `${x},${y}`;
    });
    return `M${pad},${h - pad} L${pts.join(' L')} L${w - pad},${h - pad} Z`;
  }, [data]);

  useEffect(() => {
    if (inView && ref.current) {
      const len = ref.current.getTotalLength();
      ref.current.style.strokeDasharray = `${len}`;
      ref.current.style.strokeDashoffset = `${len}`;
      ref.current.animate([{ strokeDashoffset: `${len}` }, { strokeDashoffset: '0' }], { duration: 2000, fill: 'forwards', easing: 'ease-out' });
    }
  }, [inView]);

  return (
    <div ref={containerRef} style={{ gridColumn: '1 / -1', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 16 }}>PRODUCTIVITY PULSE</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 200 }}>
        <defs>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7B2FFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        {inView && <path d={areaD} fill="url(#pulseGrad)" opacity={0.6} />}
        <path ref={ref} d={pathD} fill="none" stroke="#00FFFF" strokeWidth={2.5} strokeLinecap="round" />
        {inView && data.map((v, i) => {
          const x = data.length > 1 ? pad + (i / (data.length - 1)) * (w - pad * 2) : w / 2;
          const y = h - pad - ((v - 30) / 70) * (h - pad * 2);
          return <circle key={i} cx={x} cy={y} r={3} fill="#00FFFF" opacity={0.5}><title>{v}%</title></circle>;
        })}
      </svg>
    </div>
  );
}

/* ── Habit Matrix (Hex Grid) ── */
function HabitMatrix() {
  const grid = useDataStore((s) => s.habitGrid);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const hexR = 6;

  return (
    <div ref={ref} style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', overflow: 'hidden' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 16 }}>HABIT MATRIX · 52 WEEKS</div>
      <svg viewBox="0 0 780 110" style={{ width: '100%' }}>
        {grid.map((week, wi) =>
          week.map((val, di) => {
            const x = 10 + wi * 14.5;
            const y = 10 + di * 14;
            const colors = ['#0a0a0a', '#003344', '#006677', '#00AACC', '#00FFFF'];
            const c = colors[Math.min(val, 4)];
            const delay = (wi * 7 + di) * 2;
            return (
              <motion.rect
                key={`${wi}-${di}`}
                x={x} y={y} width={12} height={12} rx={2}
                fill={c}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: delay * 0.001, duration: 0.3 }}
                style={{ cursor: 'pointer' }}
              >
                <title>Week {wi + 1}, Day {di + 1}: {val} habits</title>
              </motion.rect>
            );
          })
        )}
      </svg>
    </div>
  );
}

/* ── Mood Distribution (Lava Blobs via CSS) ── */
function MoodDistribution() {
  const { memories } = useDataStore();
  
  const moodStats = useMemo(() => {
    if (memories.length === 0) return [
      { name: 'CALM', pct: 25, color: '#4488FF' },
      { name: 'FOCUS', pct: 25, color: '#00FFFF' },
      { name: 'STRESS', pct: 25, color: '#FF3344' },
      { name: 'CREATE', pct: 25, color: '#FF66AA' },
    ];
    
    const counts = memories.reduce((acc, m) => {
      acc[m.emotion] = (acc[m.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = memories.length;
    return [
      { name: 'CALM', pct: Math.round(((counts.calm || 0) / total) * 100), color: '#4488FF' },
      { name: 'FOCUS', pct: Math.round(((counts.happy || 0) / total) * 100), color: '#00FFFF' },
      { name: 'STRESS', pct: Math.round(((counts.sad || 0) / total) * 100), color: '#FF3344' },
      { name: 'CREATE', pct: Math.round(((counts.excited || 0) / total) * 100), color: '#FF66AA' },
    ];
  }, [memories]);

  return (
    <div style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', position: 'relative', minHeight: 260, overflow: 'hidden' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 16 }}>MOOD DISTRIBUTION</div>
      <div style={{ position: 'relative', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {moodStats.map((m, i) => {
          const size = 40 + m.pct * 1.2;
          const offsets = [[-20, -15], [25, -10], [-15, 20], [30, 25]];
          return (
            <motion.div
              key={m.name}
              animate={{ x: [offsets[i][0], offsets[i][0] + 10, offsets[i][0]], y: [offsets[i][1], offsets[i][1] - 8, offsets[i][1]] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: size, height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${m.color}55, ${m.color}11)`,
                border: `1px solid ${m.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
                filter: `blur(${1}px)`,
              }}
            >
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: m.color, letterSpacing: '0.1em' }}>{m.name}</span>
              <span style={{ fontFamily: 'var(--syne)', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{m.pct}%</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Focus Sessions (Radial Bars) ── */
function FocusSessions() {
  const sessions = useDataStore((s) => s.focusSessions);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const cx = 100, cy = 100, maxR = 85, minR = 35;

  return (
    <div ref={ref} style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 16 }}>FOCUS SESSIONS</div>
      <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: 200, margin: '0 auto', display: 'block' }}>
        {sessions.map((s, i) => {
          const r = minR + ((maxR - minR) / sessions.length) * (sessions.length - i);
          const pct = Math.min(s.hours / 8, 1);
          const angle = pct * 300;
          const rad = (angle * Math.PI) / 180;
          const x2 = cx + r * Math.sin(rad);
          const y2 = cy - r * Math.cos(rad);
          const largeArc = angle > 180 ? 1 : 0;
          const d = `M${cx},${cy - r} A${r},${r} 0 ${largeArc} 1 ${x2},${y2}`;
          return (
            <motion.path
              key={s.day}
              d={d}
              fill="none"
              stroke="#00FFFF"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.3 + i * 0.1}
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 1, ease: 'easeOut' }}
            />
          );
        })}
        <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="var(--mono)">WEEKLY</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {sessions.map((s) => (
          <span key={s.day} style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>{s.day}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Goal Completion Rings ── */
function GoalRings() {
  const goals = useDataStore((s) => s.goals);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const cx = 100, cy = 100;
  const avg = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.completion, 0) / goals.length) : 0;

  return (
    <div ref={ref} style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 16 }}>GOAL COMPLETION</div>
      <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: 200, margin: '0 auto', display: 'block' }}>
        {goals.map((g, i) => {
          const r = 85 - i * 12;
          const circ = 2 * Math.PI * r;
          const offset = circ - (g.completion / 100) * circ;
          return (
            <g key={g.id}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
              <motion.circle
                cx={cx} cy={cy} r={r}
                fill="none" stroke={g.color} strokeWidth={6} strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={inView ? { strokeDashoffset: offset } : {}}
                transition={{ delay: i * 0.2, duration: 1.2, ease: 'easeOut' }}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: `drop-shadow(0 0 4px ${g.color})` }}
              />
            </g>
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize="22" fontFamily="var(--syne)" fontWeight="800">{avg}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="var(--mono)">OVERALL</text>
      </svg>
    </div>  );
}

function AIInsight() {
  const { focusSessions, memories } = useDataStore();
  
  const insight = useMemo(() => {
    if (focusSessions.length < 3) return {
      title: "ARIA is calibrating...",
      desc: "Complete at least 3 focus sessions to unlock personalized behavioral insights.",
      btn: "Start Session"
    };
    
    const totalHours = focusSessions.reduce((a, s) => a + s.hours, 0);
    const avgHours = (totalHours / focusSessions.length).toFixed(1);
    
    return {
      title: `Average session: ${avgHours} hrs`,
      desc: `Based on your recent ${focusSessions.length} sessions, you are building a strong momentum in deep work.`,
      btn: "View Details"
    };
  }, [focusSessions]);

  return (
    <div style={{
      padding: 24, borderRadius: 16,
      border: '1px solid rgba(123,47,255,0.15)',
      background: 'linear-gradient(135deg, rgba(123,47,255,0.05), rgba(0,255,255,0.03))',
      backdropFilter: 'blur(8px)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Holographic shimmer */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        background: 'linear-gradient(105deg, transparent 40%, rgba(0,255,255,0.4) 45%, rgba(123,47,255,0.4) 50%, transparent 55%)',
        backgroundSize: '300% 100%',
        animation: 'holoShimmer 4s ease infinite',
      }} />
      <style>{`@keyframes holoShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
 
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 16 }}>AI INSIGHT</div>
        <p style={{ fontFamily: 'var(--syne)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.5, marginBottom: 12 }}>
          {insight.title}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 20 }}>
          {insight.desc}
        </p>
        <button className="btn-ghost" style={{ padding: '8px 20px', fontSize: '0.7rem' }}>{insight.btn} →</button>
      </div>
    </div>
  );
}

/* ── Live Neural Feed ── */
function NeuralFeed() {
  const { memories, goals } = useDataStore();
  const events = useMemo(() => {
    const evts = [];
    memories.slice(0, 4).forEach(m => evts.push({ time: m.date, text: `Memory added: '${m.title}'`, icon: '●' }));
    const completedGoals = goals.filter(g => g.completion === 100);
    completedGoals.slice(0, 2).forEach(g => evts.push({ time: 'Recent', text: `Goal Achieved: ${g.title}`, icon: '▲' }));
    return evts.length > 0 ? evts : [
      { time: '09:14', text: 'System initialized · Core stable', icon: '●' }
    ];
  }, [memories, goals]);

  return (
    <div style={{
      gridColumn: '1 / -1', padding: 20, borderRadius: 16,
      border: '1px solid rgba(0,255,136,0.1)',
      background: 'rgba(0,10,0,0.4)',
      backdropFilter: 'blur(8px)',
      maxHeight: 180, overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)',
      }} />
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(0,255,136,0.4)', letterSpacing: '0.15em', marginBottom: 12 }}>LIVE NEURAL FEED</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(0,255,136,0.6)' }}
          >
            <span style={{ color: 'rgba(0,255,136,0.3)' }}>{e.icon}</span>{' '}
            <span style={{ color: 'rgba(0,255,136,0.8)' }}>{e.time}</span>{' '}
            — {e.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ── */
export default function NeuralAnalytics() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 8 }}>NEURAL ANALYTICS</p>
          <h1 style={{ fontFamily: 'var(--syne)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 40 }}>
            Your Data,{' '}
            <span style={{ background: 'linear-gradient(90deg, #00FFFF, #7B2FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Alive
            </span>
          </h1>
        </motion.div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          <ProductivityPulse />
          <HabitMatrix />
          <MoodDistribution />
          <FocusSessions />
          <GoalRings />
          <AIInsight />
          <NeuralFeed />
        </div>
      </div>
    </div>
  );
}
