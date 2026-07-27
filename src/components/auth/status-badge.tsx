'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function StatusBadge() {
  const { stage } = useSimulation();
  const isActive = stage === 'operational';

  return (
    <motion.div
      className="absolute top-[8%] right-[40%] z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div
        className={`flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 shadow-sm transition-all duration-500 ${isActive ? 'scale-105 bg-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : ''}`}
      >
        <CheckCircle className="h-4 w-4 text-emerald-500" />
        <div>
          <p className="text-xs font-bold text-slate-800">All Systems Operational</p>
          <p className="text-[10px] text-slate-500">99.9% uptime</p>
        </div>
      </div>
    </motion.div>
  );
}
