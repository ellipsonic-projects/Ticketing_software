'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function AIWidget() {
  const { stage } = useSimulation();
  const isThinking = stage === 'classifying';
  const text = isThinking ? 'Thinking...' : 'Suggested Response';
  return (
    <motion.div
      className="absolute bottom-[5%] left-[45%] z-[15] scale-90 opacity-60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
    >
      <motion.div
        className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500 to-purple-600 p-4 shadow-lg"
        animate={
          isThinking
            ? {
                boxShadow: [
                  '0 0 0px rgba(139,92,246,0)',
                  '0 0 20px rgba(139,92,246,0.6)',
                  '0 0 0px rgba(139,92,246,0)',
                ],
              }
            : {}
        }
        transition={{ duration: 1 }}
      >
        <Sparkles className="h-8 w-8 text-white" strokeWidth={2} />
        {isThinking && (
          <motion.div className="absolute top-0 right-0 h-2 w-2 animate-ping rounded-full bg-yellow-300" />
        )}
      </motion.div>
      <motion.div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-white shadow-lg">
        <Sparkles className="h-2.5 w-2.5" fill="currentColor" />
        {text}
      </motion.div>
    </motion.div>
  );
}
