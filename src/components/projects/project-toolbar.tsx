'use client';

import { FolderKanban, Sparkles } from 'lucide-react';

import { SearchInput } from '@/components/shared/data-table/search-input';
import { StatusFilter } from '@/components/shared/data-table/status-filter';

interface ProjectToolbarProps {
  totalProjects: number;
}

export function ProjectToolbar({ totalProjects }: ProjectToolbarProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-8 p-7 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
              <FolderKanban className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Projects</h2>

              <p className="mt-1 text-sm text-slate-500">
                Browse and monitor all active software projects.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-80">
              <SearchInput placeholder="Search project..." />
            </div>

            <StatusFilter
              paramName="status"
              placeholder="Status"
              options={[
                {
                  label: 'Active',
                  value: 'ACTIVE',
                },
                {
                  label: 'Archived',
                  value: 'ARCHIVED',
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-amber-500" />

            <span>
              Showing
              <span className="mx-1 font-semibold text-slate-900">{totalProjects}</span>
              active project
              {totalProjects !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
