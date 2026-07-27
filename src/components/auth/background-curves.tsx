'use client';

import { motion } from 'framer-motion';

export function BackgroundCurves() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{ overflow: 'visible' }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path 1 */}
        <motion.path
          id="path1"
          d="M -100,420 Q 300,490 800,110 Q 950,60 1100,120"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="8 6"
          animate={{ strokeDashoffset: [28, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        <circle r="3.5" fill="#818cf8" filter="url(#glow-dot)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M -100,420 Q 300,490 800,110 Q 950,60 1100,120"
          />
        </circle>

        {/* Path 2 */}
        <motion.path
          id="path2"
          d="M -100,460 Q 400,310 800,160 Q 960,110 1100,180"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeOpacity="0.12"
          strokeDasharray="6 9"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        />
        <circle r="3" fill="#60a5fa" filter="url(#glow-dot)">
          <animateMotion
            dur="5.5s"
            repeatCount="indefinite"
            path="M -100,460 Q 400,310 800,160 Q 960,110 1100,180"
            begin="2s"
          />
        </circle>

        {/* Path 3 */}
        <path
          d="M -100,500 Q 200,590 800,210 Q 980,155 1100,230"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeOpacity="0.1"
        />

        {/* Path 4 */}
        <path
          d="M 200,300 Q 500,280 800,300 Q 960,308 1100,310"
          fill="none"
          stroke="#6366f1"
          strokeWidth="0.8"
          strokeOpacity="0.08"
          strokeDasharray="4 14"
        />
      </svg>
    </div>
  );
}
