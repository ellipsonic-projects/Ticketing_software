'use client';

import { motion } from 'framer-motion';

export function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400"
          style={{
            left: `${(i * 11) % 100}%`,
            top: `${(i * 17) % 100}%`,
            opacity: (i % 5) * 0.1 + 0.2,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 3 + (i % 3) * 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i % 2,
          }}
        />
      ))}
    </div>
  );
}
