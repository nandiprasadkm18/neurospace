import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles } from 'lucide-react';
import { useAIStore } from '../store/aiStore';
import { useMoodStore } from '../store/moodStore';
import ARIAOrb from '../components/ARIAOrb';
import AudioVisualizerRing from '../components/AudioVisualizerRing';

export default function AICorePage() {
  const { state, setState, messages, addMessage } = useAIStore();
  const { setMood } = useMoodStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage(input, 'user');
    const userText = input;
    setInput('');
    
    // Simulate ARIA thinking
    setState('thinking');
    
    setTimeout(() => {
      setState('speaking');
      const response = generateResponse(userText);
      addMessage(response, 'assistant');
      
      // Sentiment analysis (simple)
      if (userText.toLowerCase().includes('stress') || userText.toLowerCase().includes('anxious')) setMood('stress');
      else if (userText.toLowerCase().includes('calm') || userText.toLowerCase().includes('relax')) setMood('calm');
      else if (userText.toLowerCase().includes('create') || userText.toLowerCase().includes('build')) setMood('create');
      
      setTimeout(() => setState('idle'), 2000);
    }, 1500);
  };

  const generateResponse = (text: string) => {
    if (text.toLowerCase().includes('focus')) return "Your neural pathways are primed for depth. I suggest a 90-minute session for your 'Neural Shaders' task.";
    if (text.toLowerCase().includes('goal')) return "The 'Marathon' goal is at 68%. You've shown remarkable consistency this week.";
    return "The universe of your mind is vast and ever-expanding. How can I assist in its mapping today?";
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Scene */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
          <ARIAOrb />
          <AudioVisualizerRing />
        </Canvas>
      </div>

      {/* Chat Interface Overlay */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '40px 20px', pointerEvents: 'none' }}>
        
        {/* Messages */}
        <div 
          ref={scrollRef}
          style={{ 
            width: '100%', 
            maxWidth: 700, 
            maxHeight: '40vh', 
            overflowY: 'auto', 
            marginBottom: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 12,
            paddingRight: 10,
            pointerEvents: 'auto'
          }}
          className="no-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '12px 20px',
                  borderRadius: 20,
                  border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,255,0.2)'}`,
                  background: m.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'var(--syne)',
                  fontSize: '0.9rem',
                  color: '#fff',
                  lineHeight: 1.5
                }}
              >
                {m.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div style={{ width: '100%', maxWidth: 700, pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
            {["What should I focus on?", "Summarize my week", "Add a memory"].map((p) => (
              <button 
                key={p} 
                onClick={() => setInput(p)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Communicate with ARIA..."
              style={{
                width: '100%',
                padding: '16px 60px 16px 24px',
                borderRadius: 999,
                border: '1px solid rgba(0,255,255,0.2)',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                fontFamily: 'var(--syne)',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 0 30px rgba(0,255,255,0.05)'
              }}
            />
            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
              <button 
                onClick={() => setState(state === 'listening' ? 'idle' : 'listening')}
                style={{ background: 'none', border: 'none', color: state === 'listening' ? '#00FF88' : 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 8 }}
              >
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSend}
                style={{ background: '#00FFFF', border: 'none', color: '#000', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
