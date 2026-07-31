/* eslint-disable */
import { Permission } from './permissions';
import { Role } from './roles';

export interface Identity {
  id: string;
  tenantId: string | null;
  role: Role;
}

export class AuthorizationError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'AuthorizationError';
  }
}
