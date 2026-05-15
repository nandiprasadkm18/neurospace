import { useRef, useEffect } from 'react';

export default function NeuralConnector() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (pathRef.current) {
          const progress = Math.min(Math.max(entry.intersectionRatio, 0), 1);
          pathRef.current.style.strokeDashoffset = `${1000 - progress * 1000}`;
        }
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 19) }
    );

    const el = pathRef.current?.closest('.neural-connector');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="neural-connector">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path
          ref={pathRef}
          className="neural-path"
          d="M0,40 C200,40 250,10 400,40 C550,70 600,20 700,40 C800,60 900,15 1000,40 C1100,65 1150,40 1200,40"
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />
        {/* Synapse nodes */}
        {[200, 400, 700, 1000].map((cx) => (
          <circle key={cx} cx={cx} cy={40} r={3} fill="#00FFFF" opacity={0.6}>
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
