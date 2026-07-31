import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string; // userId for internal users; accountId for ClientPortalAccount
  tenantId: string | null;
  sessionId: string;
  role: Role;
  mustChangePassword: boolean;
  tokenType: 'access' | 'refresh';
  /** Present only when role === 'CLIENT'. References Client.id. */
  clientId?: string;
}
