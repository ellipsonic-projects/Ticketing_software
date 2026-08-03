'use client';

import { BaseHeader } from '@/components/shared/base-header';

export interface PlatformHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  onMenuClick?: () => void;
}

export function PlatformHeader(props: PlatformHeaderProps) {
  return (
    <BaseHeader
      {...props}
      roleLabel="Platform Admin"
      themeColor="violet"
      profileHref="/platform/profile"
    />
  );
}
