export const ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  ENGINEER: 'ENGINEER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
