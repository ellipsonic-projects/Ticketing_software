'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { ProjectStatus } from '@prisma/client';
import { FolderOpen, ShieldCheck, Ticket, Users } from 'lucide-react';

import { Pagination } from '@/components/shared/data-table/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { useProjects } from '@/hooks/use-projects';
import { ProjectWithClient } from '@/lib/project/project.types';

import { ProjectCard } from './project-card';
import { ProjectToolbar } from './project-toolbar';

interface ProjectGridProps {
  clientId: string;
  openProjectsInModal?: boolean;
}

type ProjectWithStats = ProjectWithClient & {
  stats?: {
    totalTickets: number;
    openTickets: number;
    engineersCount: number;
    slaHealthPercent: number;
  };
};

export function ProjectGrid({ clientId, openProjectsInModal = false }: ProjectGridProps) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 6);
  const search = searchParams.get('search') ?? undefined;
  const statusParam = searchParams.get('status');
  const status = statusParam ? (statusParam as ProjectStatus) : undefined;

  const { data, isLoading } = useProjects({
    clientId,
    page,
    limit,
    search,
    status,
    sort: 'createdAt',
    order: 'desc',
    withStats: true,
  });

  const projects: ProjectWithStats[] = data?.data ?? [];
  const totalProjects = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null);

  return (
    <section className="space-y-8">
      <ProjectToolbar totalProjects={totalProjects} />

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="animate-pulse p-4">
                <div className="h-6 w-40 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-lg bg-slate-100" />
                  ))}
                </div>
                <div className="mt-5 h-8 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-20">
          <div className="flex flex-col items-center text-center">
            <FolderOpen className="h-10 w-10 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-700">No Projects Found</h3>
            <p className="mt-2 text-sm text-slate-500">
              {search
                ? 'Try searching with another keyword.'
                : 'There are currently no projects available.'}
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      {!isLoading && projects.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={openProjectsInModal ? setSelectedProject : undefined}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white px-7 py-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-slate-500">
              Showing
              <span className="mx-1 font-semibold text-slate-900">{(page - 1) * limit + 1}</span>–
              <span className="mx-1 font-semibold text-slate-900">
                {Math.min(page * limit, totalProjects)}
              </span>
              of
              <span className="mx-1 font-semibold text-slate-900">{totalProjects}</span>
              projects
            </p>
            <Pagination totalPages={totalPages} totalItems={totalProjects} />
          </div>
        </>
      )}

      <Dialog
        open={selectedProject !== null}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader className="border-b border-slate-100 px-6 pt-6 pr-14 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-xl font-bold text-slate-900">
                      {selectedProject.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {selectedProject.client.name}
                    </DialogDescription>
                  </div>
                  <StatusBadge status={selectedProject.status} className="ml-auto shrink-0" />
                </div>
              </DialogHeader>

              <div className="space-y-6 p-6">
                <p className="text-sm leading-6 text-slate-600">
                  {selectedProject.description ||
                    'No description has been provided for this project.'}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      label: 'Tickets',
                      value: selectedProject.stats?.totalTickets ?? 0,
                      icon: Ticket,
                      color: 'text-blue-600 bg-blue-50',
                    },
                    {
                      label: 'Open',
                      value: selectedProject.stats?.openTickets ?? 0,
                      icon: Ticket,
                      color: 'text-red-600 bg-red-50',
                    },
                    {
                      label: 'Engineers',
                      value: selectedProject.stats?.engineersCount ?? 0,
                      icon: Users,
                      color: 'text-violet-600 bg-violet-50',
                    },
                    {
                      label: 'SLA Health',
                      value: `${selectedProject.stats?.slaHealthPercent ?? 100}%`,
                      icon: ShieldCheck,
                      color: 'text-emerald-600 bg-emerald-50',
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <stat.icon className={`mb-3 h-4 w-4 ${stat.color.split(' ')[0]}`} />
                      <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
