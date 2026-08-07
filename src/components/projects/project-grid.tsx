'use client';

import { useSearchParams } from 'next/navigation';

import { ProjectStatus } from '@prisma/client';
import { FolderOpen } from 'lucide-react';

import { Pagination } from '@/components/shared/data-table/pagination';
import { useProjects } from '@/hooks/use-projects';
import { ProjectWithClient } from '@/lib/project/project.types';

import { ProjectCard } from './project-card';
import { ProjectToolbar } from './project-toolbar';

interface ProjectGridProps {
  clientId: string;
}

export function ProjectGrid({ clientId }: ProjectGridProps) {
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

  const projects: ProjectWithClient[] = data?.data ?? [];
  const totalProjects = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

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
              <ProjectCard key={project.id} project={project} />
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
    </section>
  );
}
