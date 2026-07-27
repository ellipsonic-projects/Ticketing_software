'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function SupportTicketCard() {
  const { stage, cycleCount } = useSimulation();
  const [tickets, setTickets] = useState(18);
  const [resolved, setResolved] = useState(12);

  useEffect(() => {
    if (stage !== 'ticket_update') return;

    const timer = setTimeout(() => {
      setResolved((prev) => (prev >= 18 ? 12 : prev + 1));
      setTickets((prev) => (prev >= 24 ? 18 : prev + 1));
    }, 100);

    return () => clearTimeout(timer);
  }, [stage, cycleCount]);

  return (
    <motion.div
      className="absolute top-[15%] left-[5%] z-20 w-52 scale-95 rounded-[20px] border border-slate-100 bg-white/95 p-5 opacity-90 shadow-xl backdrop-blur-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 0.9, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      whileHover={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
            <Ticket className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800">Active Tickets</h3>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={tickets}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 px-2.5 py-1 text-xs font-bold text-white shadow-md"
          >
            {tickets}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="mb-4 space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-600">Resolved Today</span>
            <span className="font-bold text-slate-800">
              {resolved}/{tickets}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
              initial={{ width: `${(12 / 18) * 100}%` }}
              animate={{ width: `${(resolved / tickets) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
        <div className="h-1 w-full rounded-full bg-slate-100" />
        <div className="h-1 w-3/4 rounded-full bg-slate-100" />
      </div>
    </motion.div>
  );
}
