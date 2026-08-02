'use client';

import { CheckCircle2, CircleDot, Clock3, MessageSquare } from 'lucide-react';

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
    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', bg)}>
      <Icon className={cn('h-5 w-5', color)} />
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: SupportTimelineEvent; isLast: boolean }) {
  return (
    <div className="relative flex gap-4">
      {!isLast && <div className="absolute top-12 left-5 h-full w-px bg-slate-200" />}
      <TimelineIcon type={event.type} />
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-slate-900">{event.title}</h4>
            <p className="mt-1 text-sm text-slate-500">{event.description}</p>
          </div>
          <span className="text-xs whitespace-nowrap text-slate-400">{event.time}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SupportTimelineCard({ events }: SupportTimelineCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Support Timeline</h2>
          <p className="mt-1 text-sm text-slate-500">Latest ticket activity and updates</p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center">
            <Clock3 className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-medium text-slate-500">No recent activity</p>
            <p className="mt-1 text-sm text-slate-400">Ticket updates will appear here.</p>
          </div>
        ) : (
          <div>
            {events.map((event, index) => (
              <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <button
          type="button"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          View Full Activity
        </button>
      </div>
    </div>
  );
}
