/* eslint-disable */
import { AuthorizationError, Identity } from './authorization.types';
import { PERMISSION_MATRIX } from './permission-matrix';
import { Permission } from './permissions';
import { Role } from './roles';

export class AuthorizationService {
  /**
   * Evaluates if a user has a specific permission based on their role.
   * This is the primary pure function for checking capabilities.
   */
  can(user: Identity | null | undefined, permission: Permission): boolean {
    if (!user) return false;
    const permissionsForRole = PERMISSION_MATRIX[user.role] || [];
    return permissionsForRole.includes(permission);
  }

  /**
   * Throws an AuthorizationError if the user does not have the specified permission.
   * Use this in API route handlers to enforce least privilege.
   */
  authorizePermission(user: Identity | null | undefined, permission: Permission): void {
    if (!this.can(user, permission)) {
      throw new AuthorizationError(`Missing required permission: ${permission}`);
    }
  }

  /**
   * Ensures the user's tenant matches the resource's tenant.
   * Used as a secondary safeguard after the repository layer.
   */
  authorizeTenant(userTenantId: string | null, resourceTenantId: string): void {
    if (!userTenantId) {
      throw new AuthorizationError('Tenant context missing from user');
    }
    if (userTenantId !== resourceTenantId) {
      throw new AuthorizationError('Cross-tenant access forbidden');
    }
  }

  /**
   * Ensures the user is the owner of the resource.
   */
  authorizeOwnership(userId: string | null | undefined, ownerId: string): void {
    if (!userId || userId !== ownerId) {
      throw new AuthorizationError('User does not own this resource');
    }
  }
}

export const authorizationService = new AuthorizationService();
