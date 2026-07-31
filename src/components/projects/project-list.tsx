'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye, Loader2, MoreHorizontal, Pencil, Search, Trash2, Building2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { useProjects, useArchiveProject } from '@/hooks/use-projects';
import { useCan } from '@/hooks/use-can';

import { ProjectDashboardStats } from './project-dashboard-stats';
import { CreateProjectDialog } from './create-project-dialog';

import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar';
import { SearchInput } from '@/components/shared/data-table/search-input';
import { StatusFilter } from '@/components/shared/data-table/status-filter';
import { SortDropdown } from '@/components/shared/data-table/sort-dropdown';
import { Pagination } from '@/components/shared/data-table/pagination';
import { EmptyState } from '@/components/shared/data-table/empty-state';

interface ProjectListProps {
  clientId?: string;
}

export function ProjectList({ clientId }: ProjectListProps = {}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') as any || undefined;
  const supportStatus = searchParams.get('supportStatus') as any || undefined;
  const sort = searchParams.get('sort') as any || 'createdAt';
  const order = searchParams.get('order') as any || 'desc';

  const { data, isLoading } = useProjects({ page, limit, search, status, supportStatus, sort, order, clientId });
  const { mutateAsync: archiveProject, isPending: isArchiving } = useArchiveProject();
  
  const canCreateProject = useCan('PROJECT_CREATE');
  const canDeleteProject = useCan('PROJECT_DELETE');
  const canUpdateProject = useCan('PROJECT_UPDATE');

  const [projectToArchive, setProjectToArchive] = useState<{ id: string; name: string } | null>(null);

  const confirmArchive = async () => {
    if (!projectToArchive) return;
    try {
      await archiveProject(projectToArchive.id);
      toast.success('Project archived successfully');
      setProjectToArchive(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to archive project');
    }
  };

  const projects = data?.data || [];
  const totalProjects = data?.total || 0;
  const totalPages = data?.pages || 1;

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Manage your projects and client associations.</p>
        </div>
        {canCreateProject && <CreateProjectDialog />}
      </div>

      {/* Stats Card */}
      <ProjectDashboardStats />

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-4">
          <DataTableToolbar>
            <SearchInput placeholder="Search projects by name, code or client..." />
            <StatusFilter
              paramName="status"
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Archived', value: 'ARCHIVED' },
              ]}
            />
            <StatusFilter
              paramName="supportStatus"
              placeholder="Support..."
              options={[
                { label: 'Enabled', value: 'ENABLED' },
                { label: 'Paused', value: 'PAUSED' },
              ]}
            />
            <SortDropdown
              options={[
                { label: 'Recently Created', value: 'createdAt:desc' },
                { label: 'Oldest', value: 'createdAt:asc' },
                { label: 'Recently Updated', value: 'updatedAt:desc' },
                { label: 'Name (A-Z)', value: 'name:asc' },
                { label: 'Client', value: 'client:asc' },
              ]}
            />
          </DataTableToolbar>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8">
              <EmptyState 
                title="No projects found" 
                description={search ? 'Try adjusting your search or filters.' : 'Get started by creating a new project.'} 
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 text-xs font-semibold text-slate-500 backdrop-blur">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="w-[50px] px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="group transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-medium text-slate-900">
                          {project.name}
                        </span>
                        {project.code && (
                          <span className="truncate text-xs text-slate-500">{project.code}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{project.client?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} variant="ring" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100 data-[state=open]:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-slate-500">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => (window.location.href = `/projects/${project.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                            </DropdownMenuItem>
                            {canUpdateProject && (
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => (window.location.href = `/projects/${project.id}/edit`)}
                              >
                                <Pencil className="mr-2 h-4 w-4 text-slate-400" /> Edit Project
                              </DropdownMenuItem>
                            )}
                            {canDeleteProject && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                                  onClick={() =>
                                    setProjectToArchive({ id: project.id, name: project.name })
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Archive Project
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && (
          <div className="border-t border-slate-200 bg-slate-50/50">
            <Pagination totalPages={totalPages} totalItems={totalProjects} />
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={!!projectToArchive}
        onOpenChange={(open) => !open && !isArchiving && setProjectToArchive(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the project {projectToArchive?.name}. It will no longer be visible in the active projects list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmArchive}
              disabled={isArchiving}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isArchiving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
