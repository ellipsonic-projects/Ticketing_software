'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '@/hooks/use-projects';
import { useClients } from '@/hooks/use-clients';
import { CreateProjectInput, CreateProjectSchema } from '@/lib/project/project.schema';


export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createProject, isPending } = useCreateProject();
  
  // We only fetch active clients for project creation
  const { data: clientsData, isLoading: isLoadingClients } = useClients({ 
    page: 1, limit: 100, status: 'ACTIVE', sort: 'name', order: 'asc' 
  });
  const clients = clientsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      clientId: '',
    },
  });

  const selectedClient = watch('clientId');

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      await createProject(data);
      toast.success('Project created successfully');
      setOpen(false);
      reset();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to create project');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
          <DialogDescription className="text-slate-500">
            Create a new project and associate it with an active client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="clientId" className="text-xs font-semibold text-slate-700">
                Client Organization *
              </Label>
              <select 
                disabled={isPending || isLoadingClients} 
                value={selectedClient} 
                onChange={(e) => setValue('clientId', e.target.value, { shouldValidate: true })}
                className={`h-10 w-full rounded-md border bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.clientId ? 'border-red-400' : 'border-slate-200'}`}
              >
                <option value="" disabled>Select a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && <span className="text-[11px] text-red-500">{errors.clientId.message}</span>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Project Name *
              </Label>
              <Input
                id="name"
                {...register('name')}
                className={`h-10 bg-slate-50 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="Marketing Site"
                disabled={isPending}
              />
              {errors.name && <span className="text-[11px] text-red-500">{errors.name.message}</span>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs font-semibold text-slate-700">
                Project Code (Identifier)
              </Label>
              <Input
                id="code"
                {...register('code')}
                className="h-10 bg-slate-50 border-slate-200"
                placeholder="MKT"
                disabled={isPending}
              />
              {errors.code && <span className="text-[11px] text-red-500">{errors.code.message}</span>}
              <p className="text-[11px] text-slate-400">Used as prefix for ticket IDs (e.g. MKT-101).</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="bg-slate-50 border-slate-200"
                placeholder="Project details..."
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="h-10 px-5 font-semibold text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 min-w-[120px] rounded-lg bg-indigo-600 px-6 font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
