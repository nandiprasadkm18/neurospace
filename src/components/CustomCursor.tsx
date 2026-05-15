import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 400 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);
  const trailIdCounter = useRef(0);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Particle Stream
      const id = trailIdCounter.current++;
      setTrail((prev) => [...prev.slice(-15), { x: e.clientX, y: e.clientY, id }]);

      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, .mood-card, .btn-glass, .btn-ghost, .drag-handle, .cmdk-item, canvas'));
      setIsTextHover(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (prefers-reduced-motion: reduce) {
          .custom-cursor { display: none; }
          * { cursor: auto !important; }
        }
      `}</style>

      {/* Quantum Particle Trail */}
      {trail.map((point, i) => (
        <motion.div
          key={point.id}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            width: 2,
            height: 2,
            borderRadius: '50%',
            backgroundColor: '#00FFFF',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: (i / trail.length) * 0.5,
            scale: i / trail.length,
          }}
        />
      ))}

      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      >
        {/* Breathing Neural Ring */}
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
            opacity: isTextHover ? 0 : 1,
            rotate: isHovering ? 90 : 0
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Internal Cross/Target */}
          <motion.div 
            animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
            style={{ position: 'absolute', width: 2, height: 12, background: '#00FFFF' }} 
          />
          <motion.div 
            animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
            style={{ position: 'absolute', width: 12, height: 2, background: '#00FFFF' }} 
          />
        </motion.div>

        {/* Central Core */}
        <motion.div
          animate={{
            width: isTextHover ? 2 : 6,
            height: isTextHover ? 40 : 6,
            backgroundColor: isHovering ? '#fff' : '#00FFFF',
            boxShadow: isHovering ? '0 0 15px #fff' : '0 0 10px #00FFFF',
            borderRadius: isTextHover ? '0%' : '50%'
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
        />
        
        {/* Click Neural Ripple */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0.1, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '1px solid #7B2FFF',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
