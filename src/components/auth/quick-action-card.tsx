'use client';

import { motion } from 'framer-motion';
import { Clock, MessageSquare } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function QuickActionCard() {
  const { stage } = useSimulation();
  const isActive = stage === 'reply';
  return (
    <motion.div
      className="absolute right-[-8%] bottom-[45%] z-[15]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 0.6, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div
        className={`w-44 rounded-[20px] border border-slate-100 bg-white p-4 transition-all duration-500 ${isActive ? 'scale-[1.02] shadow-[0_0_20px_rgba(244,114,182,0.4)]' : 'shadow-xl'}`}
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 shadow-md">
            <MessageSquare className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold text-slate-800">Quick Reply</span>
        </div>

        <div className="space-y-2">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] font-medium text-slate-600">Thank you for contacting...</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>Avg response: 2.3 min</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
