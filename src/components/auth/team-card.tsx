'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function TeamCard() {
  const { stage } = useSimulation();
  const isEngineerActive = stage === 'engineer';
  const avatarColors = [
    { bg: 'from-blue-400 to-blue-600', initials: 'JD' },
    { bg: 'from-emerald-400 to-emerald-600', initials: 'SM' },
    { bg: 'from-amber-400 to-amber-600', initials: 'AK' },
  ];

  return (
    <motion.div
      className="absolute right-[8%] bottom-[22%] z-20 flex min-w-40 scale-95 flex-col items-center gap-4 rounded-[20px] border border-slate-100 bg-white/95 p-5 opacity-90 shadow-xl backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.9, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      whileHover={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md">
          <Users className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-bold text-slate-800">Team Online</span>
      </div>

      <div className="flex -space-x-3">
        {avatarColors.map((avatar, index) => (
          <motion.div
            key={index}
            className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatar.bg} relative flex items-center justify-center border-3 border-white shadow-md`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.5 + index * 0.15,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <span className="text-sm font-bold text-white">{avatar.initials}</span>
            {/* Online indicator */}
            <div className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm">
              {isEngineerActive && (
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold text-slate-700">3 members active</p>
        <p className="mt-0.5 text-[10px] text-slate-500">Working on 12 tickets</p>
      </div>
    </motion.div>
  );
}
