import { ProjectList } from '@/components/projects/project-list';

export const metadata = {
  title: 'Projects | Ticketing System',
  description: 'Manage your projects and client associations',
};

export default function ProjectsPage() {
  return (
    <div className="h-full bg-slate-50">
      <ProjectList />
    </div>
  );
}
