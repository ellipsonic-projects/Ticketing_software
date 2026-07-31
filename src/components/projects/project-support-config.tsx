'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UpdateProjectSchema } from '@/lib/project/project.schema';
import { useUpdateProject } from '@/hooks/use-projects';
import { useCan } from '@/hooks/use-can';

type SupportConfigFormValues = z.input<typeof UpdateProjectSchema>;

interface ProjectSupportConfigProps {
  project: any; // We'll use any here temporarily, ideally a Project interface from Prisma
}

export function ProjectSupportConfig({ project }: ProjectSupportConfigProps) {
  const { mutateAsync: updateProject, isPending } = useUpdateProject(project.id);
  const canUpdate = useCan('PROJECT_UPDATE');

  const form = useForm<SupportConfigFormValues>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: {
      supportStatus: project.supportStatus || 'ENABLED',
      defaultPriority: project.defaultPriority || 'MEDIUM',
      supportEmail: project.supportEmail || '',
      supportPhone: project.supportPhone || '',
      supportNotes: project.supportNotes || '',
    },
  });

  const onSubmit = async (values: SupportConfigFormValues) => {
    try {
      await updateProject(values as any);
      toast.success('Support configuration updated successfully');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to update support configuration');
    }
  };

  if (!canUpdate) {
    return (
      <div className="text-sm text-slate-500">
        You do not have permission to view or modify support configuration.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="supportStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ENABLED">Enabled</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  If paused, new tickets cannot be created for this project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultPriority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Ticket Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The default priority assigned to new tickets.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="support@company.com" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="supportNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g. Support available only during IST business hours. Escalate production issues immediately." 
                  className="min-h-[100px]"
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Internal SLA notes or guidelines for handling tickets for this project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !form.formState.isDirty} className="bg-indigo-600 hover:bg-indigo-700">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </div>
      </form>
    </Form>
  );
}
