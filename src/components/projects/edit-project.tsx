'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Building2, Loader2, Save, Settings2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useCan } from '@/hooks/use-can';
import { useProject, useUpdateProject } from '@/hooks/use-projects';
import { UpdateProjectInput, UpdateProjectSchema } from '@/lib/project/project.schema';

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
        router.push('/projects');
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
        <Skeleton className="mb-8 h-8 w-48" />
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
      router.push('/projects');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to update project');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-slate-50/50 p-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center space-x-2 text-sm font-medium text-slate-500">
          <Link href="/projects" className="transition-colors hover:text-indigo-600">
            Projects
          </Link>
          <span className="text-slate-300">/</span>
          <span className="cursor-default">{project.name}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900">Settings</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Settings</h1>
              <p className="mt-1 text-sm text-slate-500">
                Update configuration for{' '}
                <span className="font-medium text-slate-700">{project.name}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white px-6 py-5">
                <CardTitle className="text-lg">General Details</CardTitle>
                <CardDescription>
                  Note: Client association cannot be changed once a project is created to preserve
                  data integrity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 bg-slate-50/30 p-6">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <Label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Client Organization
                  </Label>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{project.client?.name}</p>
                      <p className="text-xs text-slate-500">
                        {project.client?.code || 'No Client Code'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                    Project Name *
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={`h-10 bg-white ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                    disabled={isPending}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-500">{errors.name.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="code" className="text-xs font-semibold text-slate-700">
                      Project Code (Identifier)
                    </Label>
                    <Input
                      id="code"
                      {...register('code')}
                      className="h-10 border-slate-200 bg-white"
                      disabled={isPending}
                    />
                    {errors.code && (
                      <span className="text-[11px] text-red-500">{errors.code.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-semibold text-slate-700">
                      Status
                    </Label>
                    <select
                      disabled={isPending}
                      value={selectedStatus}
                      onChange={(e) =>
                        setValue('status', e.target.value as 'ACTIVE' | 'INACTIVE', {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    className="min-h-[120px] resize-none border-slate-200 bg-white shadow-sm"
                    placeholder="Enter a brief description of the project..."
                    disabled={isPending}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/projects')}
                    disabled={isPending}
                    className="h-10 px-5 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !isDirty}
                    className="h-10 min-w-[140px] rounded-lg bg-indigo-600 px-6 font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
