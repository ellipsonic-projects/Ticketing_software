/* eslint-disable */
'use client';

import { useState } from 'react';
import { useTicket, useUpdateTicket, useAssignTicket } from '@/hooks/use-tickets';
import { useTicketComments, useCreateComment } from '@/hooks/use-ticket-comments';
import { useTicketTimeline } from '@/hooks/use-ticket-timeline';
import { useTicketAttachments, useUploadAttachment } from '@/hooks/use-ticket-attachments';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  MessageSquare, History, Paperclip, AlertCircle, 
  Clock, Shield, User, Send, CheckCircle2, XCircle, FileIcon
} from 'lucide-react';
import { TicketStatus, TicketPriority } from '@prisma/client';
import { ActivityTimeline } from '@/components/shared/activity-timeline';

export function TicketDetails({ id }: { id: string }) {
  const { user } = useAuth();
  const { data: ticket, isLoading } = useTicket(id);
  const { mutate: updateTicket } = useUpdateTicket(id);
  const { mutate: assignTicket } = useAssignTicket(id);
  
  const { data: comments, isLoading: isLoadingComments } = useTicketComments(id);
  const { mutate: createComment, isLoading: isCommenting } = useCreateComment(id);
  
  const { data: timeline, isLoading: isLoadingTimeline } = useTicketTimeline(id);
  
  const { data: attachments, isLoading: isLoadingAttachments } = useTicketAttachments(id);
  const { mutate: uploadAttachment, isLoading: isUploading } = useUploadAttachment(id);

  // We only need to fetch users if we are an admin/engineer to assign the ticket
  const canAssign = user?.role === 'TENANT_ADMIN' || user?.role === 'PLATFORM_ADMIN';
  const { data: usersData } = useUsers({ role: 'ENGINEER' });

  const [commentBody, setCommentBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  if (isLoading || !ticket) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
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

  const handleAssign = (userId: string) => {
    assignTicket({ assignedToId: userId === 'unassigned' ? null : userId });
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
        }
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAttachment(file);
    e.target.value = ''; // Reset input
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Content Area */}
      <div className="xl:col-span-2 space-y-6">
        {/* Ticket Header & Description */}
        <Card className="p-6 bg-white shadow-sm border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 text-sm text-slate-500">
                <span className="font-semibold text-blue-600">#{ticket.number}</span>
                <span>•</span>
                <span>{ticket.project?.name}</span>
                <span>•</span>
                <span>{ticket.client?.name}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none text-slate-700 bg-slate-50 rounded-lg p-4 border border-slate-100">
            {ticket.description.split('\n').map((line: string, i: number) => (
              <p key={i} className="mb-2 last:mb-0">{line}</p>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Reported by {ticket.reportedBy?.firstName} {ticket.reportedBy?.lastName}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Created {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </Card>

        {/* Tabbed Interface */}
        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6">
            <TabsTrigger 
              value="conversation" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 py-3 data-[state=active]:shadow-none"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversation
            </TabsTrigger>
            <TabsTrigger 
              value="attachments" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 py-3 data-[state=active]:shadow-none"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attachments ({attachments?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 py-3 data-[state=active]:shadow-none"
            >
              <History className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversation" className="mt-6 space-y-6 outline-none">
            {/* Comment Feed */}
            <div className="space-y-6">
              {isLoadingComments ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : comments?.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-slate-900">No comments yet</h3>
                  <p className="text-sm text-slate-500">Be the first to start the conversation.</p>
                </div>
              ) : (
                comments?.map((comment: any) => (
                  <div key={comment.id} className={`flex gap-4 ${comment.isInternal ? 'pl-4 border-l-4 border-amber-400' : ''}`}>
                    <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-sm">
                        {getInitials(comment.author?.firstName, comment.author?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div className={`px-4 py-3 border-b flex justify-between items-center ${comment.isInternal ? 'bg-amber-50/50' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </span>
                          {comment.author?.role !== 'CLIENT' && (
                            <Badge variant="secondary" className="text-[10px] uppercase h-5 px-1.5">Staff</Badge>
                          )}
                          {comment.isInternal && (
                            <Badge variant="outline" className="text-[10px] uppercase h-5 px-1.5 bg-amber-100 text-amber-800 border-amber-200">Internal Note</Badge>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <div className="p-4 text-slate-700 text-sm whitespace-pre-wrap">
                        {comment.body}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            {ticket.status !== 'CLOSED' && (
              <div className="flex gap-4 pt-6 border-t">
                <Avatar className="h-10 w-10 border shadow-sm shrink-0 hidden sm:block">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-sm">
                    {getInitials(user?.firstName || '', user?.lastName || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <form onSubmit={submitComment} className="bg-white border rounded-lg shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <Textarea 
                      placeholder="Reply to this ticket..." 
                      className="border-0 focus-visible:ring-0 rounded-none resize-y min-h-[120px] p-4 text-sm"
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                    />
                    <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t">
                      <div className="flex items-center gap-4">
                        {user?.role !== 'CLIENT' && (
                          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                              checked={isInternal}
                              onChange={(e) => setIsInternal(e.target.checked)}
                            />
                            Internal Note (Hidden from client)
                          </label>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        size="sm" 
                        disabled={isCommenting || !commentBody.trim()}
                        className={isInternal ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isInternal ? 'Add Internal Note' : 'Send Reply'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {ticket.status === 'CLOSED' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mt-6">
                <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-900">This ticket is closed</h3>
                <p className="text-sm text-gray-500 mt-1">Comments are disabled. Please open a new ticket for further assistance.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="attachments" className="mt-6 outline-none">
            <div className="space-y-6">
              {ticket.status !== 'CLOSED' && (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-100 transition-colors relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    accept=".jpg,.jpeg,.png,.pdf,.txt"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <Paperclip className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900">
                      {isUploading ? 'Uploading...' : 'Click or drag files to upload'}
                    </h3>
                    <p className="text-xs text-slate-500">Supported: JPG, PNG, PDF, TXT (Max 5MB)</p>
                  </div>
                </div>
              )}

              {isLoadingAttachments ? (
                <Skeleton className="h-32 w-full" />
              ) : attachments?.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border shadow-sm">
                  <FileIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No attachments have been uploaded to this ticket.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attachments?.map((attachment: any) => (
                    <a 
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100">
                        <FileIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{attachment.filename}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{(attachment.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{attachment.uploader?.firstName}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6 outline-none">
            <Card className="p-6 bg-white shadow-sm border">
              {isLoadingTimeline ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : timeline?.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No activity history available.</p>
              ) : (
                <ActivityTimeline events={timeline} />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar Area */}
      <div className="space-y-6">
        <Card className="bg-white shadow-sm border overflow-hidden">
          <div className="px-5 py-4 bg-slate-50/80 border-b flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-slate-500" />
            <h3 className="font-medium text-slate-900">Properties</h3>
          </div>
          
          <div className="p-5 space-y-6">
            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <Select 
                value={ticket.status} 
                onValueChange={(val) => handleStatusChange(val as TicketStatus)}
                disabled={ticket.status === 'CLOSED' || user?.role === 'CLIENT'}
              >
                <SelectTrigger className="w-full bg-white h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TicketStatus).map(s => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
              <Select 
                value={ticket.priority} 
                onValueChange={(val) => handlePriorityChange(val as TicketPriority)}
                disabled={ticket.status === 'CLOSED' || user?.role === 'CLIENT'} // Clients shouldn't escalate priority arbitrarily usually
              >
                <SelectTrigger className="w-full bg-white h-10">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TicketPriority).map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignment */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</label>
              <Select 
                value={ticket.assignedToId || 'unassigned'} 
                onValueChange={handleAssign}
                disabled={!canAssign || ticket.status === 'CLOSED'}
              >
                <SelectTrigger className="w-full bg-white h-10">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned" className="italic text-slate-500">Unassigned</SelectItem>
                  {usersData?.items?.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              {ticket.resolvedAt && (
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Resolved</p>
                    <p className="text-slate-500">{format(new Date(ticket.resolvedAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
              )}
              {ticket.closedAt && (
                <div className="flex items-start gap-3 text-sm">
                  <XCircle className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Closed</p>
                    <p className="text-slate-500">{format(new Date(ticket.closedAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}
