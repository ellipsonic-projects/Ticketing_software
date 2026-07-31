import { EditProject } from '@/components/projects/edit-project';

export const metadata = {
  title: 'Edit Project | Ticketing System',
};

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  return (
    <div className="h-full bg-slate-50">
      <EditProject projectId={id} />
    </div>
  );
}
