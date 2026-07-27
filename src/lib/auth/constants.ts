import { ROLES } from './roles';

export const ROLE_DEFAULT_ROUTE = {
  [ROLES.PLATFORM_ADMIN]: '/admin/dashboard',
  [ROLES.TENANT_ADMIN]: '/tenant/dashboard',
  [ROLES.ENGINEER]: '/engineer/dashboard',
} as const;
