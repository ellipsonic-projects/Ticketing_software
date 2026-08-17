'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion, Variants } from 'framer-motion';
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  Database,
  Folder,
  RefreshCcw,
  Ticket,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiClient } from '@/services/api/api-client';
import { cn, getStringColorGradient, getStringColorHover } from '@/lib/utils';

// Types
export interface AuditLogItem {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  actor: { name: string; avatarUrl: string | null; role: string } | null;
  ticket: {
    number: number;
    title: string;
    clientName: string;
    projectName: string;
    reportedByName: string;
    assignedToName: string | null;
  } | null;
  before: any;
  after: any;
  createdAt: string;
  tenantId: string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// Helper for formatting actions
function formatActionLabel(action: string) {
  const labels: Record<string, string> = {
    TICKET_CREATED: 'Ticket created',
    TICKET_UPDATED: 'Ticket updated',
    TICKET_ASSIGNED: 'Ticket assigned',
    TICKET_UNASSIGNED: 'Ticket unassigned',
    TICKET_COMMENT_ADDED: 'Ticket comment added',
    TICKET_INTERNAL_NOTE_ADDED: 'Internal note added',
    TENANT_ONBOARDING_STARTED: 'Tenant onboarding started',
    ADMIN_INVITATION_PENDING: 'Admin invitation pending',
    ADMIN_INVITATION_SENT: 'Admin invitation sent',
    INVITATION_ACCEPTED: 'Invitation accepted',
    TENANT_ONBOARDING_COMPLETED: 'Tenant onboarding completed',
    TENANT_UPDATED: 'Tenant edited',
    TENANT_DELETED: 'Tenant deleted',
    TENANT_ACTIVATED: 'Tenant activated',
    TENANT_SUSPENDED: 'Tenant suspended',
    TENANT_DEACTIVATED: 'Tenant deactivated',
    TENANT_PENDING_ACTIVATION: 'Tenant pending activation',
    SLA_POLICY_CREATED: 'Default SLA policy created',
    SLA_POLICY_UPDATED: 'SLA policy updated',
  };

  if (labels[action]) return labels[action];

  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getActionColor(action: string) {
  const upper = action.toUpperCase();
  if (upper.includes('INVITATION') || upper.includes('PENDING'))
    return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  if (upper.includes('ONBOARDING_COMPLETED') || upper.includes('ACTIVATED'))
    return 'bg-teal-50 text-teal-700 ring-teal-600/20';
  if (upper.includes('CREATED')) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  if (upper.includes('UPDATED') || upper.includes('CHANGED'))
    return 'bg-blue-50 text-blue-700 ring-blue-600/20';
  if (upper.includes('DELETED') || upper.includes('ARCHIVED') || upper.includes('REMOVED'))
    return 'bg-rose-50 text-rose-700 ring-rose-600/20';
  if (upper.includes('PAUSED') || upper.includes('WARNING'))
    return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  if (upper.includes('ENABLED') || upper.includes('RESOLVED'))
    return 'bg-teal-50 text-teal-700 ring-teal-600/20';
  if (upper.includes('SLA')) return 'bg-purple-50 text-purple-700 ring-purple-600/20';
  return 'bg-slate-50 text-slate-700 ring-slate-600/20';
}

function getEntityIcon(entity: string) {
  switch (entity.toLowerCase()) {
    case 'ticket':
      return <Ticket className="h-3.5 w-3.5 text-indigo-500" />;
    case 'user':
      return <User className="h-3.5 w-3.5 text-cyan-500" />;
    case 'client':
      return <Building2 className="h-3.5 w-3.5 text-fuchsia-500" />;
    case 'tenant':
      return <Building2 className="h-3.5 w-3.5 text-violet-500" />;
    case 'project':
      return <Folder className="h-3.5 w-3.5 text-orange-500" />;
    default:
      return <Database className="h-3.5 w-3.5 text-slate-400" />;
  }
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 'None';
  if (typeof value !== 'string') return String(value);
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getChangeSummary(log: AuditLogItem) {
  if (log.action === 'TICKET_CREATED') return 'Ticket created';

  const before = getRecord(log.before);
  const after = getRecord(log.after);
  if (log.action === 'ADMIN_INVITATION_PENDING') {
    return `Invitation for ${String(after?.email || 'tenant administrator')} is awaiting delivery.`;
  }
  if (log.action === 'ADMIN_INVITATION_SENT') {
    return `Invitation sent to ${String(after?.email || 'tenant administrator')}.`;
  }
  if (log.action === 'TENANT_ONBOARDING_STARTED') {
    return 'Tenant created with pending activation status.';
  }
  if (log.action === 'TENANT_ONBOARDING_COMPLETED') {
    return 'Administrator accepted the invitation and activated the tenant.';
  }
  if (log.action === 'SLA_POLICY_CREATED') return 'Default SLA policy and priority tiers created.';
  if (!before || !after) return formatActionLabel(log.action);

  const changedFields = [
    ['status', 'Status'],
    ['priority', 'Priority'],
    ['title', 'Title'],
    ['categoryId', 'Category'],
  ] as const;
  const changes = changedFields
    .filter(([field]) => before[field] !== after[field])
    .map(
      ([field, label]) => `${label}: ${formatValue(before[field])} → ${formatValue(after[field])}`,
    );

  return changes.length ? changes.join(' · ') : formatActionLabel(log.action);
}

export function AuditLogsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const { data, isLoading } = useQuery<{
    items: AuditLogItem[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>({
    queryKey: ['audit-logs', page, limit],
    queryFn: async () => {
      const res = await apiClient<{ data: any }>(`/audit-logs?page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-slate-200/60 bg-white/40 px-6 py-5 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Logs</h2>
            <p className="text-sm text-slate-500">
              Track ticket and account activity with full context
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add optional filters here later if needed */}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto px-6 lg:px-8">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="min-w-[200px] text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Date & Time
              </TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Actor
              </TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Action
              </TableHead>
              <TableHead className="min-w-[280px] text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Ticket / Resource
              </TableHead>
              <TableHead className="min-w-[260px] text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="[&_tr:last-child]:border-0"
          >
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                  <RefreshCcw className="mx-auto mb-2 h-6 w-6 animate-spin text-indigo-500" />
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : !data || data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((log) => {
                const actorName = log.actor?.name || 'System';

                return (
                  <motion.tr
                    variants={rowVariants}
                    key={log.id}
                    className={cn(
                      'group border-b border-slate-100/50 transition-colors',
                      getStringColorHover(actorName),
                    )}
                  >
                    <TableCell className="whitespace-nowrap text-slate-500">
                      <div className="text-[15px] font-medium text-slate-700">
                        {format(new Date(log.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs">{format(new Date(log.createdAt), 'hh:mm:ss a')}</div>
                    </TableCell>

                    <TableCell>
                      {log.actor ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-0">
                            <AvatarImage src={log.actor.avatarUrl || ''} />
                            <AvatarFallback
                              className={cn(
                                'bg-gradient-to-br text-xs font-bold shadow-sm ring-1 ring-inset',
                                getStringColorGradient(log.actor.name),
                              )}
                            >
                              {log.actor.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-slate-900">
                              {log.actor.name}
                            </span>
                            <span className="text-xs tracking-wider text-slate-500 uppercase">
                              {log.actor.role.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-0">
                            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-inset">
                              SYS
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[15px] font-medium text-slate-500">
                            System Activity
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ring-1 ring-inset',
                          getActionColor(log.action),
                        )}
                      >
                        {formatActionLabel(log.action)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 shadow-sm ring-1 ring-slate-200/50">
                          {getEntityIcon(log.entity)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-medium text-slate-900">
                            {log.ticket
                              ? `#${log.ticket.number} · ${log.ticket.title}`
                              : log.entity}
                          </span>
                          {log.ticket ? (
                            <>
                              <span className="text-xs text-slate-500">
                                {log.ticket.clientName} · {log.ticket.projectName}
                              </span>
                              <span className="text-xs text-slate-500">
                                Raised by {log.ticket.reportedByName}
                                {log.ticket.assignedToName
                                  ? ` · Assigned to ${log.ticket.assignedToName}`
                                  : ''}
                              </span>
                            </>
                          ) : (
                            <span className="font-mono text-xs text-slate-500">
                              ID: {log.entityId.substring(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-slate-600">
                      {getChangeSummary(log)}
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </motion.tbody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between border-t border-slate-200/60 bg-white/40 px-6 py-4 sm:flex-row lg:px-8">
        <div className="mb-4 text-sm text-slate-500 sm:mb-0">
          Showing {data?.totalItems === 0 ? 0 : ((data?.page || 1) - 1) * limit + 1} to{' '}
          {Math.min((data?.page || 1) * limit, data?.totalItems || 0)} of {data?.totalItems || 0}{' '}
          logs
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              className="h-8 rounded-full border border-slate-200/60 bg-white/60 px-3 text-sm text-slate-700 shadow-sm backdrop-blur transition-all outline-none hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              value={limit.toString()}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="15">15 per page</option>
              <option value="30">30 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data || page >= data.totalPages || isLoading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
