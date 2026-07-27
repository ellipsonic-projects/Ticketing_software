'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Play, Sparkles } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function WorkflowCard() {
  const { stage } = useSimulation();
  const stages = [
    { label: 'Receive', color: 'from-cyan-400 to-blue-500', icon: Play },
    { label: 'Process', color: 'from-indigo-400 to-purple-500', icon: Sparkles },
    { label: 'Resolve', color: 'from-emerald-400 to-teal-500', icon: CheckCircle2 },
  ];
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[460px] -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <div className="relative flex items-center justify-center gap-0">
        {stages.map((stageObj, index) => {
          const Icon = stageObj.icon;
          const isActive =
            (index === 0 && stage === 'receive') ||
            (index === 1 && stage === 'process') ||
            (index === 2 && stage === 'resolve');

          return (
            <div key={index} className="relative flex items-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
              >
                <motion.div
                  className={`bg-gradient-to-br ${stageObj.color} relative z-10 flex min-w-[108px] flex-col items-center gap-2 rounded-[20px] border border-white/15 px-5 py-3.5 text-white shadow-xl`}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.1, 1],
                          filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                        }
                      : { scale: 1, filter: 'brightness(1)' }
                  }
                  transition={isActive ? { duration: 1, repeat: 0 } : {}}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                  <span className="text-xs font-bold whitespace-nowrap">{stageObj.label}</span>
                </motion.div>
                {index === 1 && (
                  <motion.div
                    className="absolute -top-1 -right-1 z-20 h-3.5 w-3.5 rounded-full border-2 border-white bg-yellow-400 shadow-lg"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              {index < stages.length - 1 && (
                <motion.div
                  className="relative z-0 mx-1 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.2 }}
                >
                  <svg
                    width="36"
                    height="16"
                    viewBox="0 0 36 16"
                    fill="none"
                    className="overflow-visible"
                  >
                    <line
                      x1="0"
                      y1="8"
                      x2="36"
                      y2="8"
                      stroke="rgba(148,163,184,0.4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <motion.line
                      x1="0"
                      y1="8"
                      x2="36"
                      y2="8"
                      stroke="url(#flowGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6 8"
                      strokeDashoffset="0"
                      animate={isActive ? { strokeDashoffset: [-14, 0] } : { strokeDashoffset: 0 }}
                      transition={
                        isActive ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}
                      }
                    />
                    <path
                      d="M28 4 L36 8 L28 12"
                      stroke="rgba(99,102,241,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient
                        id="flowGrad"
                        x1="0"
                        y1="0"
                        x2="36"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-[20px] border border-slate-100 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-center text-xs font-bold text-slate-800">Automated Workflow</p>
        <p className="text-center text-[10px] text-slate-500">3 stages • 2.5min avg</p>
      </motion.div>
    </motion.div>
  );
}
