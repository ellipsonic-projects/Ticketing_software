import { ProjectDetails } from '@/components/projects/project-details';

export const metadata = {
  title: 'Project Details | Ticketing System',
};

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  return (
    <div className="h-full bg-slate-50">
      <ProjectDetails projectId={id} />
    </div>
  );
}
