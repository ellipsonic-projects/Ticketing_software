'use client';

import { BaseHeader } from '@/components/shared/base-header';

export interface DashboardHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  roleLabel?: string;
  onMenuClick?: () => void;
}

export function DashboardHeader(props: DashboardHeaderProps) {
  return <BaseHeader {...props} themeColor="blue" profileHref="/client/profile" />;
}
