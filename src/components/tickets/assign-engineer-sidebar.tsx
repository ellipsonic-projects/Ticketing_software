'use client';

import { useState } from 'react';

import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComment } from '@/hooks/use-ticket-comments';
import { useAssignTicket } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';

interface AssignEngineerSidebarProps {
  ticket: {
    id: string;
    number: number;
    title: string;
    assignedToId: string | null;
  } | null;
  onClose: () => void;
}

export function AssignEngineerSidebar({ ticket, onClose }: AssignEngineerSidebarProps) {
  const [search, setSearch] = useState('');
  const [selectedEngineerId, setSelectedEngineerId] = useState<string | null>(
    ticket?.assignedToId || null,
  );
  const [note, setNote] = useState('');

  // Fetch engineers (filter by ENGINEER role, excluding CLIENT users)
  const { data: usersData, isLoading: usersLoading } = useUsers({
    role: 'ENGINEER',
    pageSize: 100,
  });
  const assignMutation = useAssignTicket(ticket?.id || '');
  const commentMutation = useCreateComment(ticket?.id || '');

  const engineers = (usersData?.data as any[]) || [];
  const filteredEngineers = engineers.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAssign = async () => {
    if (!ticket) return;

    try {
      if (selectedEngineerId !== ticket.assignedToId) {
        await assignMutation.mutateAsync({ assignedToId: selectedEngineerId });
      }

      if (note.trim()) {
        await commentMutation.mutateAsync({ body: note, isInternal: true });
      }

      toast.success('Engineer assigned successfully');
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to assign engineer');
    }
  };

  if (!ticket) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 transition-opacity" onClick={onClose} />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm translate-x-0 transform flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Assign Engineer</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="space-y-1">
            <div className="text-xs font-medium tracking-wider text-slate-500 uppercase">
              Ticket
            </div>
            <div className="font-semibold text-indigo-600">
              TKT-{new Date().getFullYear()}-{ticket.number.toString().padStart(5, '0')}
            </div>
            <div className="text-sm text-slate-700">{ticket.title}</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
              Assign To <span className="text-red-500">*</span>
            </div>
            <Input
              type="text"
              placeholder="Search engineer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-slate-200 bg-slate-50"
            />

            <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto pr-2">
              {usersLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              ) : filteredEngineers.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No engineers found.</div>
              ) : (
                filteredEngineers.map((engineer) => (
                  <label
                    key={engineer.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                      selectedEngineerId === engineer.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage src={engineer.avatarUrl || ''} />
                        <AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-600">
                          {engineer.firstName[0]}
                          {engineer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {engineer.firstName} {engineer.lastName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {engineer.role === 'PLATFORM_ADMIN' || engineer.role === 'TENANT_ADMIN'
                            ? 'Admin Engineer'
                            : 'Engineer'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          selectedEngineerId === engineer.id
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedEngineerId === engineer.id && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="engineer"
                      value={engineer.id}
                      checked={selectedEngineerId === engineer.id}
                      onChange={() => setSelectedEngineerId(engineer.id)}
                      className="sr-only"
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="text-sm font-medium text-slate-900">
              Add Note <span className="font-normal text-slate-500">(Optional)</span>
            </div>
            <Textarea
              placeholder="Type a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px] resize-y border-slate-200 bg-slate-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 w-24 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={assignMutation.isPending || commentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            className="h-10 max-w-[140px] flex-1 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            disabled={assignMutation.isPending || commentMutation.isPending}
          >
            {assignMutation.isPending || commentMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Assign Ticket'
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
