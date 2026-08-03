'use client';

import { TicketPriority, TicketStatus } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Folder,
  MessageSquare,
  Paperclip,
  Ticket as TicketIcon,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTicket } from '@/hooks/use-tickets';

interface ClientTicketSidePanelProps {
  ticketId: string;
  onClose: () => void;
}

const BADGE_COLORS: Record<string, string> = {
  LOW: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
  URGENT: 'bg-purple-100 text-purple-700',
};

export function ClientTicketSidePanel({ ticketId, onClose }: ClientTicketSidePanelProps) {
  const { data: ticket, isLoading } = useTicket(ticketId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TicketIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">{ticket.title}</h2>
              <StatusBadge status={ticket.status} variant="ring" />
            </div>
            <p className="mt-1 text-sm text-slate-500">TKT-{ticket.number}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0 text-slate-400"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-slate-200 px-6 pt-2">
          <TabsList className="h-10 w-full justify-start gap-6 rounded-none bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pt-2 pb-3 text-sm font-medium text-slate-500 hover:text-slate-900 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-0 pt-2 pb-3 text-sm font-medium text-slate-500 hover:text-slate-900 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
            >
              Comments
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
          <TabsContent value="overview" className="m-0 space-y-6">
            {/* Ticket Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-slate-900">Ticket Information</h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Priority</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${BADGE_COLORS[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Project</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-slate-900">
                    <Folder className="h-3.5 w-3.5 text-slate-400" />
                    {ticket.project?.name || 'General'}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-medium text-slate-400">Description</p>
                  <p className="mt-1 text-[13px] whitespace-pre-wrap text-slate-600">
                    {ticket.description || 'No description provided.'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Created On</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-900">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Last Updated</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-900">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {formatDistanceToNow(new Date(ticket.updatedAt))} ago
                  </div>
                </div>
              </div>
            </div>

            {/* Assignee Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-slate-900">Assigned Engineer</h3>
              {ticket.assignedTo ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
                    {ticket.assignedTo.firstName[0]}
                    {ticket.assignedTo.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                    </p>
                    <p className="text-xs text-slate-500">Support Engineer</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                    ?
                  </div>
                  <p className="text-sm font-medium">Unassigned</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="m-0 text-sm text-slate-500">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p>Ticket comments and replies will be available here soon.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
