'use client';

import { useAuth } from '@/hooks/use-auth';
import { ClientHero } from '@/components/client/client-hero';
import { ProjectGrid } from '@/components/projects/project-grid';

export default function ClientProjectsPage() {
  const { user } = useAuth();

  // user and clientId are guaranteed by the parent layout.tsx
  const clientId = user!.clientId!;

  return (
    <div className="space-y-6">
      <ClientHero clientId={clientId} />
      <ProjectGrid clientId={clientId} />
    </div>
  );
}