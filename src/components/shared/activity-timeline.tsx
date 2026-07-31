'use client';

import { TimelineEvent, TimelineIcon } from '@/lib/activity/activity.schema';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Edit2, Pause, Play, Trash2, Check, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityTimelineProps {
  events?: TimelineEvent[];
  isLoading?: boolean;
}

const iconMap: Record<TimelineIcon, { icon: React.ElementType; color: string; bg: string }> = {
  plus: { icon: Plus, color: 'text-green-600', bg: 'bg-green-100' },
  edit: { icon: Edit2, color: 'text-blue-600', bg: 'bg-blue-100' },
  pause: { icon: Pause, color: 'text-orange-600', bg: 'bg-orange-100' },
  play: { icon: Play, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  trash: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-100' },
  check: { icon: Check, color: 'text-gray-600', bg: 'bg-gray-100' },
  calendar: { icon: Calendar, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  clock: { icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
};

export function ActivityTimeline({ events, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No activity history found.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => {
          const config = iconMap[event.icon] || iconMap['check'];
          const IconComponent = config.icon;

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-4">
                  <div className="relative">
                    <span className={cn('flex h-10 w-10 items-center justify-center rounded-full ring-8 ring-white', config.bg)}>
                      <IconComponent className={cn('h-5 w-5', config.color)} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{event.title}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true })} by {event.actor}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
