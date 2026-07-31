import { Role } from '@prisma/client';

/**
 * Server-side authentication identity — the verified claims extracted from a JWT.
 * This is used in RequestContext on API routes.
 *
 * Named ServerAuthIdentity to distinguish from the React AuthContext in contexts/auth-context.tsx.
 */
export interface ServerAuthIdentity {
  id: string; // The user ID (JWT sub); for CLIENT role this is the accountId
  tenantId: string | null;
  role: Role;
  sessionId: string;
  /** Present only when role === 'CLIENT'. References Client.id. */
  clientId?: string;
}

/** @deprecated Use ServerAuthIdentity instead. */
export type AuthContext = ServerAuthIdentity;
