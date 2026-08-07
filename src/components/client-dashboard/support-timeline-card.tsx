'use client';

import { CheckCircle2, CircleDot, Clock3, MessageSquare } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

import { SupportTimelineEvent } from '@/lib/client-dashboard/client-dashboard.types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SupportTimelineCardProps {
  events: SupportTimelineEvent[];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const TIMELINE_ICON_CONFIG: Record<
  SupportTimelineEvent['type'],
  { bg: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  COMMENT: { bg: 'bg-blue-50', icon: MessageSquare, color: 'text-blue-600' },
  STATUS_CHANGED: { bg: 'bg-amber-50', icon: Clock3, color: 'text-amber-600' },
  RESOLVED: { bg: 'bg-emerald-50', icon: CheckCircle2, color: 'text-emerald-600' },
  OTHER: { bg: 'bg-slate-100', icon: CircleDot, color: 'text-slate-500' },
};

function TimelineIcon({ type }: { type: SupportTimelineEvent['type'] }) {
  const { bg, icon: Icon, color } = TIMELINE_ICON_CONFIG[type];
  return (
    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-slate-200/50', bg)}>
      <Icon className={cn('h-3.5 w-3.5', color)} />
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: SupportTimelineEvent; isLast: boolean }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={itemVariants} className="relative flex gap-3">
      {!isLast && <div className="absolute top-9 left-4 h-full w-px bg-slate-200/60" />}
      <TimelineIcon type={event.type} />
      <div className="flex-1 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{event.title}</h4>
            <p className="mt-0.5 text-xs text-slate-500">{event.description}</p>
          </div>
          <span className="text-xs whitespace-nowrap text-slate-400">{event.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SupportTimelineCard({ events }: SupportTimelineCardProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
          <p className="mt-0.5 text-xs text-slate-500">Latest ticket updates</p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center">
            <Clock3 className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-medium text-slate-500">No recent activity</p>
            <p className="mt-1 text-sm text-slate-400">Ticket updates will appear here.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {events.map((event, index) => (
              <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
            ))}
          </motion.div>
        )}
      </div>

    </div>
  );
}
