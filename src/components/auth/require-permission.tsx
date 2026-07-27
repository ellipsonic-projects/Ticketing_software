'use client';

import { useCan } from '@/hooks/use-can';
import { Permission } from '@/lib/auth';

interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({
  permission,
  children,
  fallback = null,
}: RequirePermissionProps) {
  const can = useCan(permission);

  if (!can) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
