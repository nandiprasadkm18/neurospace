import { motion } from 'framer-motion';
import { Minus, Square, X, GripHorizontal } from 'lucide-react';
import { ReactNode } from 'react';

interface DraggablePanelProps {
  id: string;
  title: string;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
}

export default function DraggablePanel({ id, title, children, initialX = 100, initialY = 100 }: DraggablePanelProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'absolute',
        zIndex: 50,
        minWidth: 300,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(10,10,20,0.6)',
        backdropFilter: 'blur(25px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header / Drag Handle */}
      <div 
        style={{ 
          padding: '12px 16px', 
          background: 'rgba(255,255,255,0.03)', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab'
        }}
        className="drag-handle"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {title}
          </span>
        </div>
        <GripHorizontal size={14} color="rgba(255,255,255,0.2)" />
      </div>

      {/* Content */}
      <div style={{ padding: 20, flex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}
