'use client';

import { BaseHeader } from '@/components/shared/base-header';

export interface TenantHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  roleLabel?: string;
  onMenuClick?: () => void;
}

export function TenantHeader(props: TenantHeaderProps) {
  return <BaseHeader {...props} themeColor="blue" profileHref="/profile" />;
}
