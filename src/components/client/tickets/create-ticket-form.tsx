'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Bold,
  Clock3,
  CloudUpload,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Send,
  Ticket,
  X,
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useProjects } from '@/hooks/use-projects';
import { apiClient } from '@/services/api/api-client';
import { ProjectWithClient } from '@/lib/project/project.types';
import { TicketWithDetails } from '@/lib/ticket/ticket.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** ProjectWithClient may include slaPolicy when the API includes it. */
interface ProjectWithSla extends ProjectWithClient {
  slaPolicy?: {
    responseTimeMinutes: number;
    resolutionTimeMinutes: number;
  } | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILE_COUNT = 5;

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const formSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatHours(minutes: number): string {
  const hours = minutes / 60;
  return hours === 1 ? '1 Hour' : `${hours} Hours`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreateTicketForm() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: projectsData, isLoading: isLoadingProjects } = useProjects({
    page: 1,
    limit: 100,
    sort: 'createdAt',
    order: 'desc',
  });

  const projects: ProjectWithSla[] = projectsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { projectId: '', title: '', description: '' },
  });

  const description = useWatch({ control: form.control, name: 'description' }) ?? '';
  const selectedProjectId = useWatch({ control: form.control, name: 'projectId' }) ?? '';

  const selectedProject = projects.find((p) => p.id === selectedProjectId) as
    ProjectWithSla | undefined;

  const addFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`);
        return false;
      }
      return true;
    });

    setFiles((prev) => {
      if (prev.length + valid.length > MAX_FILE_COUNT) {
        toast.error(`Maximum ${MAX_FILE_COUNT} files allowed`);
        return prev;
      }
      return [...prev, ...valid];
    });
  }, []);

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const res = await apiClient<{ data: { ticket: TicketWithDetails } }>('/tickets', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      const ticketId = res.data.ticket.id;

      if (files.length > 0) {
        if (!accessToken) {
          throw new Error('Access token is missing. Cannot upload files.');
        }

        for (const file of files) {
          try {
            // 1. Get presigned URL
            const presignRes = await apiClient<{
              data: { url: string; key: string; publicUrl: string };
            }>(`/tickets/${ticketId}/attachments/presign`, {
              method: 'POST',
              body: JSON.stringify({
                filename: file.name,
                contentType: file.type || 'application/octet-stream',
              }),
            });
            const { url, publicUrl } = presignRes.data;

            // 2. Upload to S3
            const uploadRes = await fetch(url, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file.type || 'application/octet-stream' },
            });

            if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`);

            // 3. Save metadata
            await apiClient(`/tickets/${ticketId}/attachments`, {
              method: 'POST',
              body: JSON.stringify({
                filename: file.name,
                size: file.size,
                mimeType: file.type || 'application/octet-stream',
                url: publicUrl,
              }),
            });
          } catch (uploadError) {
            console.error(uploadError);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }

      toast.success('Ticket created');
      router.push('/client/tickets');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-2 sm:py-4">
      {/* Hero */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md ring-4 ring-blue-50/50">
          <Ticket className="h-6 w-6 text-white" />
        </div>
        <div className="pt-1">
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-slate-900">
            Create Support Ticket
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Report an issue for one of your projects. Our support team will review and assign it.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Project */}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Project <span className="text-red-500">*</span>
                    </FormLabel>

                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200/40 bg-slate-50/50 shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {isLoadingProjects ? (
                          <div className="flex items-center p-3 text-sm text-slate-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading Projects...
                          </div>
                        ) : projects.length === 0 ? (
                          <div className="p-3 text-sm text-slate-500">No projects available</div>
                        ) : (
                          projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <p className="text-xs text-slate-500">
                      Choose the project where you are facing the issue.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Issue Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Issue Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a short and clear title for the issue"
                        className="h-12 rounded-xl border-slate-200/40 bg-slate-50/50 shadow-sm transition-all hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                      />
                    </FormControl>
                    <p className="text-[13px] text-slate-500">
                      Provide a concise summary of your issue.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-900">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="overflow-hidden rounded-xl border border-slate-200/40 bg-slate-50/30 shadow-sm transition-all focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-slate-300">
                      {/* Toolbar */}
                      <div className="flex items-center gap-1 border-b border-slate-200/40 bg-slate-50/50 px-3 py-2">
                        {[Bold, Italic, List, ListOrdered, Link2].map((Icon, i) => (
                          <Button
                            key={i}
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                      {/* Textarea */}
                      <Textarea
                        {...field}
                        placeholder="Describe the issue in detail. Include steps to reproduce, expected behavior, and any other relevant information."
                        className="min-h-[120px] resize-none rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />
                      {/* Footer */}
                      <div className="flex items-center justify-end border-t border-slate-200/40 bg-transparent px-4 py-1.5">
                        <span className="text-xs text-slate-500">
                          {description.length}/5000 characters
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attachments */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Attachments <span className="font-normal text-slate-500">(Optional)</span>
              </h3>

              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 px-6 py-8 transition-all hover:border-blue-400 hover:bg-blue-50/80"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200/50 transition-transform group-hover:-translate-y-1 group-hover:shadow-md">
                    <CloudUpload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Drag and drop your files here
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    or <span className="font-medium text-blue-600">click to browse</span>
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Supports: PDF, DOCX, PNG, JPG, ZIP, TXT
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Maximum {MAX_FILE_SIZE_MB}MB per file • Up to {MAX_FILE_COUNT} files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileInput}
                  />
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <CloudUpload className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* SLA info block */}
              {selectedProject?.slaPolicy && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white px-5 py-3 shadow-sm ring-1 ring-slate-200/30">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-900">Project SLA</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock3 className="h-4 w-4" />
                      <span>
                        Resp: {formatHours(selectedProject.slaPolicy.responseTimeMinutes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-green-700">
                      <Clock3 className="h-4 w-4" />
                      <span>
                        Res: {formatHours(selectedProject.slaPolicy.resolutionTimeMinutes)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl border-slate-200 px-6 font-medium hover:bg-slate-50"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-xl bg-blue-600 px-8 font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Ticket
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
