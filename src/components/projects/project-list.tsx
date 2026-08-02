'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar';
import { EmptyState } from '@/components/shared/data-table/empty-state';
import { Pagination } from '@/components/shared/data-table/pagination';
import { SearchInput } from '@/components/shared/data-table/search-input';
import { SortDropdown } from '@/components/shared/data-table/sort-dropdown';
import { StatusFilter } from '@/components/shared/data-table/status-filter';
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { useCan } from '@/hooks/use-can';
import { useArchiveProject, useProjects } from '@/hooks/use-projects';

import { CreateProjectDialog } from './create-project-dialog';
import { ProjectDashboardStats } from './project-dashboard-stats';

interface ProjectListProps {
  clientId?: string;
  selectedProjectId?: string | null;
  onSelectProject?: (id: string) => void;
}

export function ProjectList({
  clientId,
  selectedProjectId,
  onSelectProject,
}: ProjectListProps = {}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || undefined;
  const status = (searchParams.get('status') as any) || undefined;
  const supportStatus = (searchParams.get('supportStatus') as any) || undefined;
  const sort = (searchParams.get('sort') as any) || 'createdAt';
  const order = (searchParams.get('order') as any) || 'desc';

  const { data, isLoading } = useProjects({
    page,
    limit,
    search,
    status,
    supportStatus,
    sort,
    order,
    clientId,
  });
  const { mutateAsync: archiveProject, isPending: isArchiving } = useArchiveProject();

  const canCreateProject = useCan('PROJECT_CREATE');
  const canDeleteProject = useCan('PROJECT_DELETE');
  const canUpdateProject = useCan('PROJECT_UPDATE');

  const [projectToArchive, setProjectToArchive] = useState<{ id: string; name: string } | null>(
    null,
  );

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
    <div className="flex h-full flex-col">
      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
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
                description={
                  search
                    ? 'Try adjusting your search or filters.'
                    : 'Get started by creating a new project.'
                }
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 text-xs font-semibold text-slate-500 backdrop-blur">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Support Status</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Support Since</th>
                  <th className="px-6 py-4">Created On</th>
                  <th className="w-[80px] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {projects.map((project) => {
                  const isSelected = selectedProjectId === project.id;
                  return (
                    <tr
                      key={project.id}
                      onClick={() => onSelectProject?.(project.id)}
                      className={`group cursor-pointer transition-colors duration-150 hover:bg-slate-50 ${
                        isSelected
                          ? 'border-l-2 border-indigo-600 bg-slate-50'
                          : 'border-l-2 border-transparent'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'}`}
                          >
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span
                              className={`truncate font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}
                            >
                              {project.name}
                            </span>
                            <span className="truncate text-xs text-slate-500">
                              {project.description || project.code || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-700">
                            {project.client?.name?.substring(0, 2).toUpperCase() || 'NA'}
                          </div>
                          <span className="font-medium text-slate-700">
                            {project.client?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            project.supportStatus === 'ENABLED'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                              : project.supportStatus === 'PAUSED'
                                ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
                                : 'bg-slate-50 text-slate-700 ring-slate-600/10'
                          }`}
                        >
                          {project.supportStatus === 'ENABLED'
                            ? 'Enabled'
                            : project.supportStatus === 'PAUSED'
                              ? 'Paused'
                              : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={project.status} variant="ring" />
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {project.supportStartDate
                          ? new Date(project.supportStartDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 focus:outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs text-slate-500">
                                  Actions
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/projects/${project.id}`;
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                                </DropdownMenuItem>
                                {canUpdateProject && (
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/projects/${project.id}/edit`;
                                    }}
                                  >
                                    <Pencil className="mr-2 h-4 w-4 text-slate-400" /> Edit Project
                                  </DropdownMenuItem>
                                )}
                                {canDeleteProject && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setProjectToArchive({ id: project.id, name: project.name });
                                      }}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Archive Project
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              This will archive the project {projectToArchive?.name}. It will no longer be visible
              in the active projects list.
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
