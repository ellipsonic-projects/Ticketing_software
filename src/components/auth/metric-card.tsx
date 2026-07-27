'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users } from 'lucide-react';

export function MetricCard() {
  return (
    <motion.div
      className="absolute top-[55%] right-[25%] z-[15] scale-95 opacity-70"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 0.7, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className="min-w-[160px] rounded-[20px] border border-slate-100/70 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500 shadow-sm">
              <Users className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold text-slate-800">Active Users</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">2,847</span>
          <div className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600">+23%</span>
          </div>
        </div>

        <p className="mt-1 text-xs text-slate-500">vs last week</p>
      </div>
    </motion.div>
  );
}
