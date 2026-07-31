'use client';

import { useEffect } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Skeleton } from '@/components/ui/skeleton';

import { useProject, useUpdateProject } from '@/hooks/use-projects';
import { UpdateProjectInput, UpdateProjectSchema } from '@/lib/project/project.schema';
import { useCan } from '@/hooks/use-can';

export function EditProject({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(projectId);
  const { mutateAsync: updateProject, isPending } = useUpdateProject(projectId);
  const canUpdateProject = useCan('PROJECT_UPDATE');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(UpdateProjectSchema),
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (project) {
      if (project.archivedAt) {
        toast.error('Archived projects cannot be edited');
        router.push(`/projects/${project.id}`);
        return;
      }
      reset({
        name: project.name,
        code: project.code || '',
        description: project.description || '',
        status: project.status,
      });
    }
  }, [project, reset, router]);

  if (!canUpdateProject) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-slate-900">Access Denied</h2>
        <p className="mt-2 text-slate-500">You do not have permission to edit projects.</p>
        <Button onClick={() => router.push('/projects')} className="mt-6" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-[400px] w-full max-w-3xl rounded-xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-slate-900">Project Not Found</h2>
        <Button onClick={() => router.push('/projects')} className="mt-6" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }



  const onSubmit = async (data: UpdateProjectInput) => {
    try {
      await updateProject(data);
      toast.success('Project updated successfully');
      router.push(`/projects/${project.id}`);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to update project');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button onClick={() => router.push(`/projects/${project.id}`)} variant="outline" size="icon" className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Project</h1>
          <p className="text-sm text-slate-500">Update project details and settings.</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Note: Client association cannot be changed once a project is created to preserve data integrity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Client Organization</Label>
                <Input value={project.client?.name || ''} disabled className="bg-slate-100" />
                <p className="text-[11px] text-slate-400">Belongs to client: {project.client?.name}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Project Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={`h-10 bg-white ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                  disabled={isPending}
                />
                {errors.name && <span className="text-[11px] text-red-500">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="code" className="text-xs font-semibold text-slate-700">Project Code (Identifier)</Label>
                  <Input
                    id="code"
                    {...register('code')}
                    className="h-10 bg-white border-slate-200"
                    disabled={isPending}
                  />
                  {errors.code && <span className="text-[11px] text-red-500">{errors.code.message}</span>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status</Label>
                  <select 
                    disabled={isPending} 
                    value={selectedStatus} 
                    onChange={(e) => setValue('status', e.target.value as 'ACTIVE' | 'INACTIVE', { shouldValidate: true, shouldDirty: true })}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className="bg-white border-slate-200 min-h-[100px]"
                  disabled={isPending}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(`/projects/${project.id}`)}
                  disabled={isPending}
                  className="h-10 px-5 font-semibold text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !isDirty}
                  className="h-10 min-w-[120px] rounded-lg bg-indigo-600 px-6 font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
