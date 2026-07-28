import { useAuth } from '@/hooks/use-auth';
import { Role } from '@/lib/auth';

/**
 * Checks if the current user has a specific role.
 * Prefer `useCan` for business logic; use this primarily for diagnostics or strictly role-based UI variations.
 */
export function useRole(role: Role): boolean {
  const { user } = useAuth();
  return user?.role === role;
}
