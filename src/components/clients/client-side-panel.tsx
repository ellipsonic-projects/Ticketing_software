'use client';

import { format } from 'date-fns';
import { CheckCircle2, Clock, FolderOpen, Pencil, Ticket, X } from 'lucide-react';

import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useClient, useClientActivity, useClientStats } from '@/hooks/use-clients';

interface ClientSidePanelProps {
  clientId: string;
  onClose: () => void;
}

export function ClientSidePanel({ clientId, onClose }: ClientSidePanelProps) {
  const { data: clientWrapper, isLoading: isLoadingClient } = useClient(clientId);
  const { data: stats, isLoading: isLoadingStats } = useClientStats(clientId);
  const { data: activity, isLoading: isLoadingActivity } = useClientActivity(clientId, 1, 5);

  const client = clientWrapper?.client;

  if (isLoadingClient || !client) {
    return (
      <div className="flex h-full w-[400px] flex-col border-l border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded-md bg-slate-200" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-6 w-24 animate-pulse rounded-md bg-slate-200" />
        </div>
      </div>
    );
  }

  // Format the resolution time (e.g., 2d 4h)
  const formatResolutionTime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const d = Math.floor(minutes / (24 * 60));
    const h = Math.floor((minutes % (24 * 60)) / 60);
    if (d > 0 && h > 0) return `${d}d ${h}h`;
    if (d > 0) return `${d}d`;
    if (h > 0) return `${h}h`;
    return `${minutes}m`;
  };

  return (
    <div className="flex h-full w-[400px] flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
        <h2 className="text-[15px] font-semibold text-slate-900">{client.name}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-slate-500 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
            {client.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="mt-4">
            <StatusBadge status={client.status} variant="ring" />
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Client Information</h3>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs font-medium"
              onClick={() => (window.location.href = `/clients/${client.id}?tab=edit`)}
            >
              <Pencil className="mr-1.5 h-3 w-3" /> Edit
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Company Name</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">{client.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Email</p>
              {client.email ? (
                <a
                  href={`mailto:${client.email}`}
                  className="mt-0.5 block text-[13px] font-medium text-blue-600 hover:underline"
                >
                  {client.email}
                </a>
              ) : (
                <p className="mt-0.5 text-[13px] text-slate-500 italic">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Phone</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {client.phone || <span className="text-slate-500 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Industry</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {client.industry || <span className="text-slate-500 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Website</p>
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block text-[13px] font-medium text-blue-600 hover:underline"
                >
                  {client.website}
                </a>
              ) : (
                <p className="mt-0.5 text-[13px] text-slate-500 italic">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Address</p>
              <p className="mt-0.5 text-[13px] font-medium whitespace-pre-line text-slate-900">
                {client.address || <span className="text-slate-500 italic">Not provided</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Summary</h3>
          {isLoadingStats || !stats ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-start justify-center rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-bold text-slate-900">{stats.totalProjects}</span>
                </div>
                <span className="mt-1 text-[11px] font-medium text-slate-500">Projects</span>
              </div>

              <div className="flex flex-col items-start justify-center rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-purple-600" />
                  <span className="text-lg font-bold text-slate-900">{stats.totalTickets}</span>
                </div>
                <span className="mt-1 text-[11px] font-medium text-slate-500">Tickets</span>
              </div>

              <div className="flex flex-col items-start justify-center rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-lg font-bold text-slate-900">
                    {stats.slaHealthPercent}%
                  </span>
                </div>
                <span className="mt-1 text-[11px] font-medium text-slate-500">SLA Compliance</span>
              </div>

              <div className="flex flex-col items-start justify-center rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-lg font-bold text-slate-900">
                    {formatResolutionTime(stats.avgResolutionTimeMinutes)}
                  </span>
                </div>
                <span className="mt-1 text-[11px] font-medium text-slate-500">
                  Avg. Resolution Time
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-[11px] font-medium text-blue-600 hover:text-blue-700"
              onClick={() => (window.location.href = `/clients/${client.id}?tab=activity`)}
            >
              View All
            </Button>
          </div>

          <div className="pt-2">
            <ActivityTimeline events={activity?.data} isLoading={isLoadingActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
