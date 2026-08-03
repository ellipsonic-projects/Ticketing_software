'use client';

import Image from 'next/image';
import Link from 'next/link';

import { format, formatDistanceToNow } from 'date-fns';
import { ArrowRight, Clock, Folder, MessageSquare, Paperclip } from 'lucide-react';

import { TicketWithDetails } from '@/lib/ticket/ticket.types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BORDER_COLORS: Record<string, string> = {
  LOW: 'border-l-emerald-500',
  MEDIUM: 'border-l-amber-500',
  HIGH: 'border-l-red-500',
  URGENT: 'border-l-purple-600',
};

const BADGE_COLORS: Record<string, string> = {
  LOW: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
  URGENT: 'bg-purple-100 text-purple-700',
};

const SLA_HOURS_URGENT = 4;
const SLA_HOURS_WARNING = 24;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SlaDisplayInfo {
  text: string;
  textColor: string;
  iconColor: string;
}

function getSlaDisplay(ticket: TicketWithDetails): SlaDisplayInfo {
  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';

  if (isResolved) {
    return {
      text: 'Resolved',
      textColor: 'text-emerald-600',
      iconColor: 'text-emerald-500',
    };
  }

  if (!ticket.sla?.resolutionBreachAt) {
    return { text: 'No SLA', textColor: 'text-slate-400', iconColor: 'text-slate-400' };
  }

  const breachDate = new Date(ticket.sla.resolutionBreachAt);
  const now = new Date();

  if (now > breachDate) {
    return { text: 'Breached', textColor: 'text-red-600 font-semibold', iconColor: 'text-red-500' };
  }

  const hoursRemaining = (breachDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const timeText = `${formatDistanceToNow(breachDate)} remaining`;

  if (hoursRemaining < SLA_HOURS_URGENT) {
    return { text: timeText, textColor: 'text-red-600 font-semibold', iconColor: 'text-red-500' };
  }
  if (hoursRemaining < SLA_HOURS_WARNING) {
    return {
      text: timeText,
      textColor: 'text-amber-600 font-semibold',
      iconColor: 'text-amber-500',
    };
  }
  return {
    text: timeText,
    textColor: 'text-emerald-600 font-semibold',
    iconColor: 'text-emerald-500',
  };
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TicketCardProps {
  ticket: TicketWithDetails;
  isSelected?: boolean;
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TicketCard({ ticket, isSelected, onClick }: TicketCardProps) {
  const sla = getSlaDisplay(ticket);

  const assigneeInitials = ticket.assignedTo
    ? `${ticket.assignedTo.firstName[0]}${ticket.assignedTo.lastName[0]}`.toUpperCase()
    : '?';

  return (
    <div
      onClick={onClick}
      className={`group flex cursor-pointer flex-col gap-3 rounded-xl border-y border-r border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center ${BORDER_COLORS[ticket.priority]} ${
        isSelected
          ? 'border-r-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20'
          : 'border-r-slate-200'
      }`}
    >
      {/* Column 1: Meta */}
      <div className="flex w-full flex-col gap-1 md:w-32 lg:w-40">
        <span className="font-semibold text-slate-900">TKT-{ticket.number}</span>
        <span className="text-xs text-slate-500">
          Created: {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
        </span>
        <div className="mt-1">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${BADGE_COLORS[ticket.priority]}`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>

      {/* Column 2: Main Content */}
      <div className="flex-1 space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{ticket.title}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Folder className="h-4 w-4" />
          <span>{ticket.category?.name ?? ticket.project.name}</span>
        </div>
        <p className="line-clamp-1 text-sm text-slate-500">{ticket.description}</p>
      </div>

      {/* Column 3: Assignee */}
      <div className="w-full md:w-40 lg:w-48">
        <span className="text-xs font-medium text-slate-500">Assigned Engineer</span>
        <div className="mt-1 flex items-center gap-3">
          {ticket.assignedTo?.avatarUrl ? (
            <Image
              src={ticket.assignedTo.avatarUrl}
              alt={ticket.assignedTo.firstName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
              {assigneeInitials}
            </div>
          )}
          <span className="text-sm font-medium text-slate-900">
            {ticket.assignedTo
              ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
              : 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Column 4: SLA */}
      <div className="w-full md:w-32 lg:w-36">
        <span className="text-xs font-medium text-slate-500">SLA</span>
        <div className="mt-1 flex items-center gap-2">
          <Clock className={`h-4 w-4 ${sla.iconColor}`} />
          <span className={`text-sm ${sla.textColor}`}>{sla.text}</span>
        </div>
      </div>

      {/* Column 5: Activity & Action */}
      <div className="flex w-full items-center justify-between gap-4 md:w-48">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Last Updated</span>
          <span className="text-sm font-medium text-slate-900">
            {formatDistanceToNow(new Date(ticket.updatedAt))} ago
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {ticket._count.comments} comments
            </span>
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {ticket._count.attachments} attachments
            </span>
          </div>
        </div>

        <button
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isSelected
              ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
              : 'border-slate-200 text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-900'
          }`}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
