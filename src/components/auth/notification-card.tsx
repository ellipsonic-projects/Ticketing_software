import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';

import { useSimulation } from './use-simulation';

export function NotificationCard() {
  const { stage } = useSimulation();

  const isVisible = stage !== 'idle';
  const shouldGlow = stage === 'arrived';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-[20%] left-[25%] z-20"
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-indigo-500 to-blue-600 p-3 shadow-lg"
            animate={
              shouldGlow
                ? {
                    boxShadow: [
                      '0 0 0px rgba(99,102,241,0)',
                      '0 0 20px rgba(99,102,241,0.6)',
                      '0 0 0px rgba(99,102,241,0)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-indigo-500 bg-red-500" />
            </div>
            <div className="relative flex h-9 w-48 flex-col justify-center overflow-hidden">
              <p className="truncate text-xs font-bold text-white">New Ticket Assigned</p>
              <p className="truncate text-[10px] text-indigo-100">
                High priority issue requires attention
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
