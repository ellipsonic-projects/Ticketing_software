'use client';

import { motion } from 'framer-motion';

export function CompositionBridge() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cg-flow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="cg-flow2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.0" />
            <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#6366f1" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="cg-flow3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="cg-corridor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.00" />
            <stop offset="35%" stopColor="#6366f1" stopOpacity="0.055" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.055" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
          </linearGradient>
          <radialGradient id="cg-halo" cx="54%" cy="50%" r="22%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="900" fill="url(#cg-halo)" />
        <path
          d="M 420,450 C 620,450 760,445 1080,450"
          stroke="url(#cg-corridor)"
          strokeWidth="110"
          strokeLinecap="round"
        />
        <motion.path
          d="M 510,390 C 640,340 780,330 970,370"
          stroke="url(#cg-flow1)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="9 7"
          animate={{ strokeDashoffset: [32, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 545,510 C 690,560 840,548 1010,508"
          stroke="url(#cg-flow2)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="6 9"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'linear', delay: 0.5 }}
        />
        <path
          d="M 470,310 C 640,250 840,260 1020,320"
          stroke="url(#cg-flow3)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="5 12"
        />
        <motion.path
          d="M 490,580 C 660,640 860,620 1040,572"
          stroke="rgba(99,102,241,0.14)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 11"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.1 }}
        />
        <motion.circle
          cx="640"
          cy="358"
          r="3"
          fill="#6366f1"
          fillOpacity="0.35"
          animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="790"
          cy="344"
          r="2.5"
          fill="#8b5cf6"
          fillOpacity="0.28"
          animate={{ scale: [1, 1.3, 1], opacity: [0.28, 0.5, 0.28] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
        />
        <motion.circle
          cx="910"
          cy="358"
          r="2"
          fill="#6366f1"
          fillOpacity="0.22"
          animate={{ scale: [1, 1.3, 1], opacity: [0.22, 0.4, 0.22] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }}
        />
      </svg>
    </div>
  );
}
