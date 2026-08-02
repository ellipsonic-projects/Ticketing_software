/* eslint-disable */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TicketPriority } from '@prisma/client';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/hooks/use-projects';
import { useCreateTicket } from '@/hooks/use-tickets';
import { CreateTicketInput, CreateTicketSchema } from '@/lib/ticket/ticket.schema';

export function CreateTicketForm() {
  const router = useRouter();
  // @ts-ignore
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects(new URLSearchParams());
  // @ts-ignore
  const { mutate: createTicket, isLoading: isCreating } = useCreateTicket();

  const [formData, setFormData] = useState<Partial<CreateTicketInput>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    projectId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = CreateTicketSchema.safeParse(formData);
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        title: formatted.title?._errors[0] || '',
        description: formatted.description?._errors[0] || '',
        projectId: formatted.projectId?._errors[0] || '',
      });
      return;
    }

    createTicket(result.data, {
      onSuccess: (res) => {
        // @ts-ignore
        router.push(`/tickets/${res.data.ticket.id}`);
      },
      onError: (error) => {
        setErrors({ root: (error as Error).message });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-lg border bg-white p-6 shadow-sm"
    >
      {errors.root && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errors.root}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Brief summary of the issue"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectId">Project</Label>
        <Select
          value={formData.projectId}
          // @ts-ignore
          onValueChange={(value) => setFormData({ ...formData, projectId: value })}
        >
          <SelectTrigger className={errors.projectId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingProjects ? (
              <div className="p-2 text-sm text-slate-500">Loading projects...</div>
            ) : (
              // @ts-ignore
              projectsData?.items.map((project: any) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.projectId && <p className="text-sm text-red-600">{errors.projectId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData({ ...formData, priority: value as TicketPriority })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(TicketPriority).map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide detailed information about the issue, steps to reproduce, or requested changes..."
          rows={8}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`resize-y ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isCreating}
        >
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Ticket
        </Button>
      </div>
    </form>
  );
}
