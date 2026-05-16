import { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { Play, Pause, RotateCcw, Volume2, Search, Plus, Save, Edit2, Check } from 'lucide-react';
import DraggablePanel from '../components/DraggablePanel';
import HolographicClock from '../components/HolographicClock';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';
import { engine } from '../utils/AudioEngine';

export default function DreamWorkspacePage() {
  const [open, setOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [playingTracks, setPlayingTracks] = useState<Record<string, boolean>>({});
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isNoteActive, setIsNoteActive] = useState(false);
  
  const { timerState, setTimer, setTimerMode, noteContent, setNoteContent } = useWorkspaceStore();
  const { goals, vision, milestones, toggleTaskStatus, addMemory, logFocusSession, addWorkspaceTask, updateVision, addMilestone, cycleMilestoneStatus } = useDataStore();
  
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [tempVision, setTempVision] = useState(vision);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  
  // Show only ad-hoc workspace tasks (not global goals)
  const workspaceTasks = useMemo(() => {
    const workspaceGoal = goals.find(g => g.id === 'workspace');
    if (!workspaceGoal) return [];
    
    return workspaceGoal.tasks
      .map(t => ({ ...t, goalId: 'workspace', category: 'workspace' }))
      .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  }, [goals]);

  // Spotlight listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Initialize audio engine on interaction
  const [audioStarted, setAudioStarted] = useState(false);
  const handleAudioStart = async () => {
    if (!audioStarted) {
      await engine.start();
      setAudioStarted(true);
    }
  };

  const handleCrystallize = () => {
    if (!noteContent.trim()) return;
    addMemory({
      id: Math.random().toString(36).substr(2, 9),
      title: noteContent.substring(0, 30) + '...',
      description: noteContent,
      emotion: 'calm',
      tags: ['workspace', 'focus', 'note']
    });
    setNoteContent('');
    setIsNoteActive(false);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000', overflow: 'hidden', position: 'relative' }} onClick={handleAudioStart}>
      
      {/* Canvas Background Grid */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        zIndex: 1 
      }} />

      {/* Holographic Clock in corner */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, zIndex: 2 }}>
        <Canvas camera={{ position: [0, 0, 10] }}>
          <HolographicClock />
        </Canvas>
      </div>

      {/* Workspace Panels */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        
        {/* Timer Panel */}
        <DraggablePanel id="timer" title="Focus Timer" initialX={60} initialY={100}>
          <div style={{ textAlign: 'center' }}>
            {isEditingTime ? (
              <input 
                type="number"
                autoFocus
                value={customMinutes}
                onChange={e => setCustomMinutes(e.target.value)}
                onBlur={() => {
                  setIsEditingTime(false);
                  const mins = parseInt(customMinutes);
                  if (!isNaN(mins) && mins > 0) {
                    setTimerMode('custom', mins * 60);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsEditingTime(false);
                    const mins = parseInt(customMinutes);
                    if (!isNaN(mins) && mins > 0) {
                      setTimerMode('custom', mins * 60);
                    }
                  }
                }}
                style={{ fontFamily: 'var(--syne)', fontSize: '3.5rem', fontWeight: 800, color: '#00FFFF', background: 'transparent', border: 'none', outline: 'none', width: '100%', textAlign: 'center', marginBottom: 20 }}
              />
            ) : (
              <h1 
                onClick={() => {
                  if (!timerState.running) {
                    setIsEditingTime(true);
                    setCustomMinutes(Math.floor(timerState.time / 60).toString());
                  }
                }}
                style={{ fontFamily: 'var(--syne)', fontSize: '3.5rem', fontWeight: 800, color: '#00FFFF', marginBottom: 20, cursor: timerState.running ? 'default' : 'pointer' }}
                title={!timerState.running ? "Click to set custom time" : ""}
              >
                {formatTime(timerState.time)}
              </h1>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => setTimer({ running: !timerState.running })}
                style={{ padding: '10px 24px', borderRadius: 99, background: timerState.running ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,255,0.2)', border: '1px solid rgba(0,255,255,0.3)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {timerState.running ? <Pause size={16} /> : <Play size={16} />}
                {timerState.running ? 'PAUSE' : 'START'}
              </button>
              <button 
                onClick={() => setTimerMode(timerState.mode)}
                style={{ padding: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
              {(['pomodoro', 'deep', 'flow', 'custom'] as const).map(m => (
                <span 
                  key={m} 
                  onClick={() => {
                    if (m === 'custom') {
                      setIsEditingTime(true);
                      setCustomMinutes(Math.floor(timerState.time / 60).toString());
                    } else {
                      setTimerMode(m);
                    }
                  }}
                  style={{ fontSize: '0.6rem', fontFamily: 'var(--mono)', color: timerState.mode === m ? '#00FFFF' : 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', cursor: 'pointer' }}
                >
                  {m.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </DraggablePanel>

        {/* Tasks Panel */}
        <DraggablePanel id="tasks" title="Task Constellation" initialX={450} initialY={100}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {workspaceTasks.map(t => (
              <div 
                key={t.id} 
                onClick={() => toggleTaskStatus(t.goalId, t.id)}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: 12, 
                  background: t.done ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${t.done ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${t.done ? '#00FF88' : 'rgba(255,255,255,0.3)'}`, background: t.done ? '#00FF88' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.done && <div style={{ width: 6, height: 6, background: '#000', borderRadius: 1 }} />}
                </div>
                <span style={{ fontSize: '0.85rem', color: t.done ? 'rgba(255,255,255,0.4)' : '#fff', textDecoration: t.done ? 'line-through' : 'none', flex: 1 }}>
                  {t.title}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--mono)' }}>{t.category.toUpperCase()}</span>
              </div>
            ))}
            {isAddingTask ? (
              <div style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <input 
                  autoFocus
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTaskTitle.trim()) {
                      addWorkspaceTask(newTaskTitle.trim());
                      setNewTaskTitle('');
                      setIsAddingTask(false);
                    }
                    if (e.key === 'Escape') {
                      setIsAddingTask(false);
                    }
                  }}
                  placeholder="Task title..."
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '0.85rem' }}
                />
                <button 
                  onClick={() => {
                    if (newTaskTitle.trim()) {
                      addWorkspaceTask(newTaskTitle.trim());
                      setNewTaskTitle('');
                      setIsAddingTask(false);
                    }
                  }}
                  style={{ background: 'rgba(0,255,255,0.2)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#00FFFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
                >
                  ADD
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingTask(true)}
                style={{ padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Task
              </button>
            )}
          </div>
        </DraggablePanel>

        {/* Ambient Sounds Panel */}
        <DraggablePanel id="sounds" title="Ambient Soundscape" initialX={60} initialY={450}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Deep Space', 'Rain', 'Forest'].map(s => {
              const type = s === 'Deep Space' ? 'space' : s === 'Rain' ? 'rain' : 'forest';
              const isPlaying = playingTracks[type] || false;
              return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ flex: 1, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{s}</span>
                <button
                  onClick={() => {
                    handleAudioStart();
                    engine.toggleTrack(type, !isPlaying);
                    setPlayingTracks(prev => ({ ...prev, [type]: !isPlaying }));
                  }}
                  style={{ background: 'none', border: 'none', color: isPlaying ? '#00FFFF' : 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <input 
                  type="range" 
                  defaultValue={0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    engine.setVolume(type, val);
                    handleAudioStart(); // ensure audio is running
                  }}
                  style={{ width: 100, accentColor: '#00FFFF' }} 
                />
                <Volume2 size={14} color="rgba(255,255,255,0.2)" />
              </div>
            )})}
          </div>
        </DraggablePanel>

        {/* Notes Panel */}
        <DraggablePanel id="notes" title="Notes Archive" initialX={800} initialY={100}>
          <div style={{ minHeight: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <textarea 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Stream of consciousness..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: 'var(--syne)', fontSize: '0.95rem', lineHeight: 1.6, resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--mono)' }}>REAL TIME</span>
              <button onClick={handleCrystallize} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#00FFFF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                <Save size={14} /> CRYSTALLIZE
              </button>
            </div>
          </div>
        </DraggablePanel>

        {/* Vision Mapping Panel */}
        <DraggablePanel id="vision" title="Vision Map" initialX={450} initialY={450}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {isEditingVision ? (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: '#B28DFF', letterSpacing: '0.1em', marginBottom: 4 }}>5-YEAR HORIZON</div>
                  <input 
                    value={tempVision.fiveYearHorizon}
                    onChange={e => setTempVision({ ...tempVision, fiveYearHorizon: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', width: '100%', borderRadius: 8, fontFamily: 'var(--syne)', fontSize: '1rem', outline: 'none' }}
                  />
                  <textarea 
                    value={tempVision.fiveYearDescription}
                    onChange={e => setTempVision({ ...tempVision, fiveYearDescription: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '8px', width: '100%', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: '0.75rem', marginTop: 8, height: 60, resize: 'none', outline: 'none' }}
                  />
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: '#00FFFF', letterSpacing: '0.1em', marginBottom: 4 }}>1-YEAR OBJECTIVE</div>
                  <input 
                    value={tempVision.oneYearObjective}
                    onChange={e => setTempVision({ ...tempVision, oneYearObjective: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,255,0.3)', color: '#fff', padding: '8px', width: '100%', borderRadius: 8, fontFamily: 'var(--syne)', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <button 
                  onClick={() => {
                    updateVision(tempVision);
                    setIsEditingVision(false);
                  }}
                  style={{ background: 'rgba(0,255,255,0.2)', border: '1px solid #00FFFF', borderRadius: 8, padding: '8px', color: '#00FFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  <Check size={14} /> SAVE VISION
                </button>
              </>
            ) : (
              <>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <button onClick={() => setIsEditingVision(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                    <Edit2 size={14} />
                  </button>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: '#B28DFF', letterSpacing: '0.1em', marginBottom: 4 }}>5-YEAR HORIZON</div>
                  <div style={{ fontFamily: 'var(--syne)', fontSize: '1.2rem', color: '#fff' }}>{vision.fiveYearHorizon}</div>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 8, lineHeight: 1.5 }}>
                    {vision.fiveYearDescription}
                  </p>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: '#00FFFF', letterSpacing: '0.1em', marginBottom: 4 }}>1-YEAR OBJECTIVE</div>
                  <div style={{ fontFamily: 'var(--syne)', fontSize: '1.1rem', color: '#fff' }}>{vision.oneYearObjective}</div>
                </div>
              </>
            )}
          </div>
        </DraggablePanel>

        {/* Milestones Panel */}
        <DraggablePanel id="milestones" title="Milestones" initialX={800} initialY={450}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {milestones.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: m.status === 'locked' ? 0.4 : 1 }}>
                <div 
                  onClick={() => cycleMilestoneStatus(m.id)}
                  style={{ 
                    width: 12, height: 12, borderRadius: '50%', cursor: 'pointer',
                    background: m.status === 'done' ? '#00FF88' : m.status === 'active' ? '#00FFFF' : 'transparent',
                    border: `1px solid ${m.status === 'done' ? '#00FF88' : m.status === 'active' ? '#00FFFF' : 'rgba(255,255,255,0.2)'}`,
                    boxShadow: m.status !== 'locked' ? `0 0 10px ${m.status === 'done' ? '#00FF88' : '#00FFFF'}` : 'none'
                  }} 
                />
                <span style={{ 
                  fontFamily: 'var(--mono)', fontSize: '0.8rem', 
                  color: m.status === 'done' ? 'rgba(255,255,255,0.5)' : '#fff',
                  textDecoration: m.status === 'done' ? 'line-through' : 'none'
                }}>
                  {m.title}
                </span>
                {m.status === 'active' && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#00FFFF', fontFamily: 'var(--mono)' }}>IN PROGRESS</span>}
              </div>
            ))}
            
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newMilestoneTitle.trim()) {
                    addMilestone(newMilestoneTitle.trim());
                    setNewMilestoneTitle('');
                  }
                }}
                placeholder="Add milestone..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: '0.75rem', outline: 'none' }}
              />
              <button 
                onClick={() => {
                  if (newMilestoneTitle.trim()) {
                    addMilestone(newMilestoneTitle.trim());
                    setNewMilestoneTitle('');
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#00FFFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </DraggablePanel>

      </div>

      {/* Spotlight Command Palette */}
      <AnimatePresence>
        {open && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh' }} onClick={() => setOpen(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 600, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(20,20,30,0.9)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', overflow: 'hidden' }}
            >
              <Command label="Command Menu">
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Search size={18} color="rgba(255,255,255,0.3)" />
                  <Command.Input 
                    placeholder="Search commands or tasks..." 
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '1rem', marginLeft: 12, fontFamily: 'var(--syne)' }}
                  />
                </div>
                <Command.List style={{ maxHeight: 300, overflowY: 'auto', padding: 8 }}>
                  <Command.Empty style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No results found.</Command.Empty>
                  
                  <Command.Group heading="ACTIONS" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', padding: '10px 12px', letterSpacing: '0.1em' }}>
                    {['Add Task', 'Log Memory', 'Change Mood', 'Start Focus Session'].map(a => (
                      <Command.Item key={a} style={{ padding: '12px', borderRadius: 8, color: '#fff', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} className="cmdk-item">
                        <Plus size={14} opacity={0.5} /> {a}
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .cmdk-item[data-selected="true"] {
          background: rgba(0,255,255,0.1);
          color: #00FFFF !important;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
