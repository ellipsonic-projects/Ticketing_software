import { useAuth } from '@/hooks/use-auth';
import { authorizationService, Permission } from '@/lib/auth';

/**
 * The primary UI authorization hook.
 * Determines if the current user has the specified permission.
 */
export function useCan(permission: Permission): boolean {
  const { user } = useAuth();
  return authorizationService.can(user, permission);
}
