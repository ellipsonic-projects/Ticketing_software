'use client';

import { BaseHeader } from '@/components/shared/base-header';

export interface EngineerHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  roleLabel?: string;
  onMenuClick?: () => void;
}

export function EngineerHeader(props: EngineerHeaderProps) {
  return (
    <BaseHeader
      {...props}
      themeColor="blue"
      searchPlaceholder="Search clients, projects, tickets..."
    />
  );
}
