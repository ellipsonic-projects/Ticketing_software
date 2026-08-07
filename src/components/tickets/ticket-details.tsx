'use client';

import { useMemo, useState } from 'react';

import { TicketPriority, TicketStatus } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  AlertTriangle,
  AtSign,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileIcon,
  Info,
  MessageSquare,
  Monitor,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useTicketAttachments, useUploadAttachment } from '@/hooks/use-ticket-attachments';
import { useCreateComment, useTicketComments } from '@/hooks/use-ticket-comments';
import { useAssignTicket, useTicket, useUpdateTicket } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { isValidMimeType, MAX_FILE_SIZE_BYTES } from '@/lib/storage/file-validation';
import { cn } from '@/lib/utils';

export function TicketDetails({ id }: { id: string }) {
  const { user } = useAuth();
  const { data: ticket, isLoading } = useTicket(id);
  const { mutate: updateTicket, isPending: isUpdatingTicket } = useUpdateTicket(id);
  const { mutate: assignTicket } = useAssignTicket(id);

  const { data: comments, isLoading: isLoadingComments } = useTicketComments(id);
  const { mutate: createComment, isPending: isCommenting } = useCreateComment(id);

  const { data: attachments, isLoading: isLoadingAttachments } = useTicketAttachments(id);
  const { mutate: uploadAttachment, isPending: isUploading } = useUploadAttachment(id);

  const canAssign = user?.role === 'TENANT_ADMIN' || user?.role === 'PLATFORM_ADMIN';
  const { data: usersData } = useUsers({ role: 'ENGINEER', pageSize: 100 });
  const engineers: any[] = (usersData?.data as any[]) || [];

  const [commentBody, setCommentBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const slaStatus = useMemo(() => {
    if (!ticket?.sla?.resolutionBreachAt) return null;
    const now = new Date();
    const breachDate = new Date(ticket.sla.resolutionBreachAt);

    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      if (ticket.sla.resolvedAt && new Date(ticket.sla.resolvedAt) > breachDate) return 'Breached';
      return 'On Track';
    }

    if (now > breachDate) return 'Breached';
    const hoursLeft = (breachDate.getTime() - now.getTime()) / 3600000;
    if (hoursLeft < 2) return 'At Risk';
    return 'On Track';
  }, [ticket]);

  const formattedId = useMemo(() => {
    if (!ticket) return '';
    const year = new Date(ticket.createdAt).getFullYear();
    return `TKT-${year}-${String(ticket.number).padStart(6, '0')}`;
  }, [ticket]);

  if (isLoading || !ticket) {
    return (
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <div>
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: TicketStatus) => {
    updateTicket({ status });
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    updateTicket({ priority });
  };

  const handleAssign = (userId: string | null) => {
    if (userId) {
      assignTicket({ assignedToId: userId === 'unassigned' ? null : userId });
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    createComment(
      { body: commentBody, isInternal },
      {
        onSuccess: () => {
          setCommentBody('');
          setIsInternal(false);
        },
      },
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`${file.name} exceeds 5MB limit`);
      e.target.value = '';
      return;
    }

    if (!isValidMimeType(file.type)) {
      toast.error(`${file.name} has an unsupported file type`);
      e.target.value = '';
      return;
    }

    uploadAttachment(file);
    e.target.value = '';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatRole = (role: string) => {
    if (role === 'PLATFORM_ADMIN') return 'Platform Admin';
    if (role === 'TENANT_ADMIN') return 'Admin';
    if (role === 'ENGINEER') return 'Engineer';
    if (role === 'CLIENT') return 'Client';
    return role;
  };

  const getRoleColor = (role: string) => {
    if (role === 'TENANT_ADMIN' || role === 'PLATFORM_ADMIN') return 'bg-indigo-50 text-indigo-700';
    if (role === 'ENGINEER') return 'bg-emerald-50 text-emerald-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-8 xl:col-span-2">
          {/* Ticket Header */}
          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
            <div className="p-6 md:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600">
                <Badge
                  variant="secondary"
                  className="rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700 hover:bg-indigo-100"
                >
                  #{ticket.number}
                </Badge>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5 px-1">
                  <Monitor className="h-3.5 w-3.5 text-indigo-500" /> {ticket.project?.name}{' '}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </span>
                <span className="flex items-center gap-1.5 px-1">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500" /> {ticket.client?.name}
                </span>
              </div>

              <div className="mb-3 flex items-start justify-between gap-4">
                <h1 className="text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
                  {ticket.title}
                </h1>
                {ticket.priority === 'URGENT' && (
                  <Badge
                    variant="outline"
                    className="shrink-0 gap-1.5 rounded-md border-red-200 bg-red-50 px-3 py-1 text-xs font-bold tracking-wide text-red-600"
                  >
                    <AlertCircle className="h-3.5 w-3.5" /> URGENT
                  </Badge>
                )}
              </div>

              <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-slate-600">
                {ticket.description}
              </p>

              <div className="flex flex-wrap items-center gap-5 border-b border-slate-100 pb-8 text-sm text-slate-500">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7 bg-indigo-100">
                    <AvatarFallback className="bg-indigo-100 text-xs font-bold text-indigo-700">
                      {getInitials(ticket.reportedBy?.firstName, ticket.reportedBy?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-slate-900">
                    {ticket.reportedBy?.firstName} {ticket.reportedBy?.lastName}
                  </span>
                  <span className="text-slate-500">reported this</span>
                </div>
                <span className="hidden text-slate-300 sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {formatDistanceToNow(new Date(ticket.createdAt))} ago
                </div>
                <span className="hidden text-slate-300 sm:inline">|</span>
                <div className="font-medium text-slate-500">
                  ID: <span className="text-slate-700">{formattedId}</span>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-8">
                {/* Priority */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                    <AlertTriangle
                      className={cn(
                        'h-5 w-5',
                        ticket.priority === 'URGENT'
                          ? 'text-red-500'
                          : ticket.priority === 'HIGH'
                            ? 'text-orange-500'
                            : 'text-blue-500',
                      )}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">Priority</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {ticket.priority.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-slate-100 md:block" />
                {/* Status */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-4 border-blue-50">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">Status</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {ticket.status.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-slate-100 md:block" />
                {/* SLA Status */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                    <AlertCircle
                      className={cn(
                        'h-5 w-5',
                        slaStatus === 'At Risk'
                          ? 'text-orange-500'
                          : slaStatus === 'Breached'
                            ? 'text-red-500'
                            : 'text-green-500',
                      )}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">SLA Status</p>
                    <p
                      className={cn(
                        'text-sm font-bold',
                        slaStatus === 'At Risk'
                          ? 'text-orange-500'
                          : slaStatus === 'Breached'
                            ? 'text-red-500'
                            : 'text-green-500',
                      )}
                    >
                      {slaStatus || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-slate-100 md:block" />
                {/* Last Updated */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">Last Updated</p>
                    <p className="text-sm font-bold text-slate-900">
                      {format(new Date(ticket.updatedAt), 'MMM d, yyyy hh:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabbed Interface */}
          <Tabs defaultValue="conversation" className="w-full">
            <TabsList className="mb-6 h-auto w-full justify-start gap-6 rounded-none border-b border-slate-200 bg-transparent p-0">
              <TabsTrigger
                value="conversation"
                className="rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-bold text-slate-500 shadow-none transition-colors hover:text-slate-900 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Conversation
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-bold text-slate-500 shadow-none transition-colors hover:text-slate-900 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600"
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Attachments
                {attachments && attachments.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full bg-indigo-50 px-2 text-xs text-indigo-700 hover:bg-indigo-100"
                  >
                    {attachments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="space-y-6 outline-none">
              <div className="space-y-4">
                {isLoadingComments ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                ) : comments?.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-500">No comments yet.</div>
                ) : (
                  comments?.map((comment: any) => (
                    <div
                      key={comment.id}
                      className={cn(
                        'rounded-xl border bg-white p-5 shadow-sm transition-all',
                        comment.isInternal ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200',
                      )}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-indigo-100 text-xs font-bold text-indigo-700">
                              {getInitials(comment.author?.firstName, comment.author?.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {comment.author?.firstName} {comment.author?.lastName}
                            </span>
                            {comment.author?.role && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'h-5 rounded-sm px-1.5 py-0 text-[10px] font-bold tracking-wide uppercase',
                                  getRoleColor(comment.author.role),
                                )}
                              >
                                {formatRole(comment.author.role)}
                              </Badge>
                            )}
                            {comment.isInternal && (
                              <Badge
                                variant="outline"
                                className="h-5 rounded-sm border-amber-300 bg-amber-100 px-1.5 text-[10px] font-bold tracking-wide text-amber-800 uppercase"
                              >
                                Internal Note
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-400">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </span>
                          <button className="text-slate-400 transition-colors hover:text-slate-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="pl-12 text-[15px] leading-relaxed whitespace-pre-wrap text-slate-700">
                        {comment.body}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {ticket.status !== 'CLOSED' && (
                <div className="mt-8 pt-4">
                  <form
                    onSubmit={submitComment}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  >
                    <Textarea
                      placeholder="Write a reply..."
                      className="min-h-[100px] resize-y rounded-none border-0 p-5 text-[15px] placeholder:text-slate-400 focus-visible:ring-0"
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-3.5">
                      <div className="flex items-center gap-4 text-slate-400">
                        <button type="button" className="transition-colors hover:text-indigo-600">
                          <Smile className="h-5 w-5" />
                        </button>
                        <button type="button" className="transition-colors hover:text-indigo-600">
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <button type="button" className="transition-colors hover:text-indigo-600">
                          <AtSign className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        {user?.role !== 'CLIENT' && (
                          <label className="group flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0"
                              checked={isInternal}
                              onChange={(e) => setIsInternal(e.target.checked)}
                            />
                            <span>Internal Note</span>
                            <Info className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                          </label>
                        )}
                        <Button
                          type="submit"
                          disabled={isCommenting || !commentBody.trim()}
                          className="flex h-10 overflow-hidden rounded-lg bg-indigo-600 px-0 font-semibold shadow-sm transition-all hover:bg-indigo-700"
                        >
                          <span className="flex h-full items-center border-r border-indigo-700/50 px-5">
                            <Send className="mr-2 h-4 w-4" />
                            Send Reply
                          </span>
                          <span className="flex h-full items-center px-3">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </TabsContent>

            <TabsContent value="attachments" className="outline-none">
              {/* ... Attachments content (keep mostly same, just styled) ... */}
              {ticket.status !== 'CLOSED' && (
                <div className="group relative mb-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition-colors hover:border-indigo-300 hover:bg-indigo-50/50">
                  <input
                    type="file"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    accept=".jpg,.jpeg,.png,.pdf,.txt"
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:ring-indigo-200">
                      <FileIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isUploading ? 'Uploading...' : 'Click or drag files to upload'}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Supported: JPG, PNG, PDF, TXT (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {isLoadingAttachments ? (
                <Skeleton className="h-32 w-full rounded-2xl" />
              ) : attachments?.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white py-12 text-center shadow-sm">
                  <p className="text-sm font-medium text-slate-500">No attachments uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {attachments?.map((attachment: any) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
                    >
                      <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                        <FileIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {attachment.filename}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </span>
                          <span>•</span>
                          <span className="font-medium">{attachment.uploader?.firstName}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Area */}
        <div className="relative">
          <div className="sticky top-6 space-y-6">
            <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-2.5 text-slate-800">
                  <Info className="h-5 w-5" />
                  <h3 className="text-base font-bold">Ticket Properties</h3>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                    Status
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={(val) => handleStatusChange(val as TicketStatus)}
                    disabled={
                      ticket.status === 'CLOSED' || user?.role === 'CLIENT' || isUpdatingTicket
                    }
                  >
                    <SelectTrigger className="h-11 w-full rounded-lg border-slate-200 bg-white font-bold text-slate-900 shadow-sm transition-colors hover:border-slate-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg font-bold shadow-lg">
                      {Object.keys(TicketStatus).map((s) => (
                        <SelectItem key={s} value={s} className="my-0.5 cursor-pointer rounded-md">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                'h-2.5 w-2.5 rounded-full',
                                s === 'OPEN'
                                  ? 'bg-amber-500'
                                  : s === 'IN_PROGRESS'
                                    ? 'bg-blue-500'
                                    : s === 'RESOLVED'
                                      ? 'bg-green-500'
                                      : 'bg-slate-500',
                              )}
                            />
                            {s.replace(/_/g, ' ')}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                    Priority
                  </label>
                  <Select
                    value={ticket.priority}
                    onValueChange={(val) => handlePriorityChange(val as TicketPriority)}
                    disabled={
                      ticket.status === 'CLOSED' || user?.role === 'CLIENT' || isUpdatingTicket
                    }
                  >
                    <SelectTrigger className="h-11 w-full rounded-lg border-slate-200 bg-white font-bold text-slate-900 shadow-sm transition-colors hover:border-slate-300">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg font-bold shadow-lg">
                      {Object.keys(TicketPriority).map((p) => (
                        <SelectItem key={p} value={p} className="my-0.5 cursor-pointer rounded-md">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                'h-2.5 w-2.5 rounded-full',
                                p === 'URGENT'
                                  ? 'bg-red-500'
                                  : p === 'HIGH'
                                    ? 'bg-orange-500'
                                    : p === 'MEDIUM'
                                      ? 'bg-amber-400'
                                      : 'bg-blue-400',
                              )}
                            />
                            {p}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                    Assignee <User className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  <Select
                    value={ticket.assignedToId || 'unassigned'}
                    onValueChange={handleAssign}
                    disabled={!canAssign || ticket.status === 'CLOSED'}
                  >
                    <SelectTrigger className="!h-auto w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-colors hover:border-slate-300 [&>span]:line-clamp-none [&>span]:flex [&>span]:w-full">
                      <SelectValue placeholder="Unassigned">
                        {ticket.assignedTo ? (
                          <div className="flex w-full items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                {getInitials(
                                  ticket.assignedTo.firstName,
                                  ticket.assignedTo.lastName,
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col overflow-hidden">
                              <span className="truncate text-sm leading-tight font-bold text-slate-900">
                                {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                              </span>
                              <span className="truncate text-xs leading-tight text-slate-500">
                                {formatRole(ticket.assignedTo.role)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium text-slate-500">Unassigned</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      <SelectItem value="unassigned" className="font-medium text-slate-500">
                        Unassigned
                      </SelectItem>
                      {engineers.map((u) => (
                        <SelectItem
                          key={u.id}
                          value={u.id}
                          className="my-0.5 cursor-pointer rounded-md p-2"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-indigo-50 text-[10px] font-bold text-indigo-700">
                                {getInitials(u.firstName, u.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">
                                {u.firstName} {u.lastName}
                              </span>
                              <span className="text-xs text-slate-500">{formatRole(u.role)}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reporter */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                    Reporter
                  </label>
                  <Select disabled value="reporter">
                    <SelectTrigger className="!h-auto w-full cursor-default rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-left opacity-100 shadow-sm [&>span]:line-clamp-none [&>span]:flex [&>span]:w-full">
                      <SelectValue>
                        <div className="flex w-full items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-indigo-100 text-[10px] font-bold text-indigo-700">
                              {getInitials(
                                ticket.reportedBy?.firstName,
                                ticket.reportedBy?.lastName,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-1 flex-col overflow-hidden">
                            <span className="truncate text-sm leading-tight font-bold text-slate-900">
                              {ticket.reportedBy?.firstName} {ticket.reportedBy?.lastName}
                            </span>
                            <span className="truncate text-xs leading-tight text-slate-500">
                              {ticket.reportedBy?.role
                                ? formatRole(ticket.reportedBy.role)
                                : 'User'}
                            </span>
                          </div>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                  </Select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 text-xs font-medium text-slate-500">
                <Calendar className="h-4 w-4" />
                Created on {format(new Date(ticket.createdAt), 'MMM d, yyyy hh:mm a')}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
