import { describe, expect, it } from 'vitest';

import { authorizationService } from '@/lib/auth/authorization.service';
import { AuthorizationError, Identity } from '@/lib/auth/authorization.types';
import { Permission } from '@/lib/auth/permissions';
import { ROLES } from '@/lib/auth/roles';

describe('AuthorizationService', () => {
  const platformAdmin: Identity = { id: '1', role: ROLES.PLATFORM_ADMIN, tenantId: 'tenant-1' };
  const tenantAdmin: Identity = { id: '2', role: ROLES.TENANT_ADMIN, tenantId: 'tenant-1' };
  const engineer: Identity = { id: '3', role: ROLES.ENGINEER, tenantId: 'tenant-1' };

  describe('can()', () => {
    it('should allow platform admin to perform platform actions', () => {
      expect(authorizationService.can(platformAdmin, Permission.TENANT_CREATE)).toBe(true);
      expect(authorizationService.can(platformAdmin, Permission.MANAGE_SETTINGS)).toBe(true);
    });

    it('should allow tenant admin to perform tenant actions', () => {
      expect(authorizationService.can(tenantAdmin, Permission.USER_CREATE)).toBe(true);
      expect(authorizationService.can(tenantAdmin, Permission.TENANT_UPDATE)).toBe(true);
    });

    it('should deny tenant admin from platform actions', () => {
      expect(authorizationService.can(tenantAdmin, Permission.TENANT_CREATE)).toBe(false);
      expect(authorizationService.can(tenantAdmin, Permission.MANAGE_SETTINGS)).toBe(false);
    });

    it('should restrict engineers to scoped actions', () => {
      expect(authorizationService.can(engineer, Permission.TICKET_UPDATE)).toBe(true);
      expect(authorizationService.can(engineer, Permission.USER_CREATE)).toBe(false);
    });
  });

  describe('authorizePermission()', () => {
    it('should not throw if permission is granted', () => {
      expect(() =>
        authorizationService.authorizePermission(platformAdmin, Permission.TENANT_CREATE),
      ).not.toThrow();
    });

    it('should throw AuthorizationError if permission is denied', () => {
      expect(() =>
        authorizationService.authorizePermission(engineer, Permission.TENANT_CREATE),
      ).toThrow(AuthorizationError);
    });
  });

  describe('authorizeTenant()', () => {
    it('should allow if tenant IDs match', () => {
      expect(() => authorizationService.authorizeTenant('t1', 't1')).not.toThrow();
    });

    it('should throw if tenant IDs do not match', () => {
      expect(() => authorizationService.authorizeTenant('t1', 't2')).toThrow(AuthorizationError);
    });
  });

  describe('authorizeOwnership()', () => {
    it('should allow if user is owner', () => {
      expect(() => authorizationService.authorizeOwnership('u1', 'u1')).not.toThrow();
    });

    it('should throw if user is not owner', () => {
      expect(() => authorizationService.authorizeOwnership('u1', 'u2')).toThrow(AuthorizationError);
    });
  });
});
