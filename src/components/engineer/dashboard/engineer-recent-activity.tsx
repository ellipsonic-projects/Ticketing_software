'use client';

import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Loader2 } from 'lucide-react';

import { useActivity } from '@/hooks/use-activity';
import { TimelineEvent } from '@/lib/activity/activity.schema';

export function EngineerRecentActivity() {
  const { data, isLoading, isError } = useActivity(1, 5); // Just fetch top 5

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-semibold text-slate-900">Recent Activity</h3>
        <Link
          href="/engineer/activity"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all activity
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            Failed to load activity
          </div>
        ) : data?.data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No recent activity
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {data?.data.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex shrink-0 items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    {/* Render icon based on event type, assuming standard icons */}
                    <span className="text-xs font-bold">{event.title[0]}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                    <span className="ml-2 text-xs whitespace-nowrap text-slate-500">
                      {formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
