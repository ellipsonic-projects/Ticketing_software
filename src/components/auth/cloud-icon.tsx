'use client';

import { motion } from 'framer-motion';
import { Cloud, UploadCloud } from 'lucide-react';

export function CloudIcon() {
  return (
    <motion.div
      className="absolute top-[45%] right-[32%] z-[15] scale-90 opacity-70"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.7, scale: 0.9 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
    >
      <div className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg">
        <Cloud className="h-8 w-8 text-white" strokeWidth={2} />
        <motion.div
          className="absolute -top-3 -right-2 rounded-full bg-white p-1 shadow-md"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <UploadCloud className="h-3 w-3 text-indigo-500" />
        </motion.div>
      </div>
    </motion.div>
  );
}
