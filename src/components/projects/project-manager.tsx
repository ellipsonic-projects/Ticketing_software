'use client';

import { useState } from 'react';

import { useCan } from '@/hooks/use-can';

import { CreateProjectDialog } from './create-project-dialog';
import { ProjectList } from './project-list';
import { ProjectSidePanel } from './project-side-panel';

export function ProjectManager() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const canCreateProject = useCan('PROJECT_CREATE');

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Management</h1>
          <p className="text-sm text-slate-500">
            Manage all projects and their support configurations.
          </p>
        </div>
        {canCreateProject && <CreateProjectDialog />}
      </div>

      {/* Main Grid */}
      <div
        className={`grid h-[calc(100vh-160px)] min-h-0 gap-6 transition-all duration-300 ease-in-out ${
          selectedProjectId ? 'grid-cols-[1fr_400px]' : 'grid-cols-1'
        }`}
      >
        {/* Left Pane - List */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ProjectList
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />
        </div>

        {/* Right Pane - Detail */}
        {selectedProjectId && (
          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <ProjectSidePanel
              projectId={selectedProjectId}
              onClose={() => setSelectedProjectId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
