'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function AnalyticsCard() {
  const { stage, cycleCount } = useSimulation();
  const [data, setData] = useState([45, 85, 65, 95, 140, 100, 125]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = 150;

  useEffect(() => {
    if (stage !== 'analytics') return;

    const timer = setTimeout(() => {
      setData((prev) => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 50) + 90];
        return next;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [stage, cycleCount]);

  return (
    <motion.div
      className="absolute bottom-[10%] left-[3%] z-20 w-72 scale-95 rounded-[20px] border border-slate-100 bg-white/95 p-5 opacity-90 shadow-xl backdrop-blur-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 0.9, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      whileHover={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
            <BarChart3 className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">Response Times</h3>
            <p className="text-xs text-slate-500">Weekly Overview</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-600">+12%</span>
        </div>
      </div>

      <div className="flex h-28 items-end gap-2">
        {/* Y-axis Labels */}
        <div className="flex h-full w-6 flex-col justify-between pb-5 text-[9px] font-medium text-slate-400">
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="relative flex h-full flex-1 items-end justify-between gap-1.5 border-b border-slate-100 pb-5">
          {data.map((val, i) => {
            const isHighest = val === Math.max(...data);
            return (
              <div key={i} className="group flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className={`w-full rounded-t-lg ${
                    isHighest
                      ? 'bg-gradient-to-t from-violet-500 to-purple-600'
                      : 'bg-gradient-to-t from-violet-400 to-purple-500'
                  } relative overflow-hidden shadow-md`}
                  style={{ height: `${(val / maxValue) * 100}%`, transformOrigin: 'bottom' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                  whileHover={{ scaleY: 1.1, transition: { duration: 0.2 } }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                </motion.div>
                {/* Value tooltip on hover */}
                <span className="absolute -top-6 rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis Labels */}
      <div className="mt-2 flex justify-between pl-8 text-[10px] font-semibold text-slate-500">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </motion.div>
  );
}
