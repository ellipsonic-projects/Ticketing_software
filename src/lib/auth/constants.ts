import { ROLES } from './roles';

export const ROLE_DEFAULT_ROUTE = {
  [ROLES.PLATFORM_ADMIN]: '/platform/tenants',
  [ROLES.TENANT_ADMIN]: '/users',
  [ROLES.ENGINEER]: '/users',
  [ROLES.CLIENT]: '/client/dashboard',
} as const;
