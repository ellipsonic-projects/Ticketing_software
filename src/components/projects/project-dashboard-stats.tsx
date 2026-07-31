import { useProjectStats } from '@/hooks/use-projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, CheckCircle2, Clock, Archive } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectDashboardStats() {
  const { data: stats, isLoading } = useProjectStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Projects',
      value: stats?.total || 0,
      icon: FolderKanban,
      color: 'text-blue-500',
    },
    {
      title: 'Active',
      value: stats?.active || 0,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      title: 'Inactive',
      value: stats?.inactive || 0,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      title: 'Archived',
      value: stats?.archived || 0,
      icon: Archive,
      color: 'text-slate-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {statItems.map((item, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
