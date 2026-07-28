import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  tenantId: string | null;
  sessionId: string;
  role: Role;
  mustChangePassword: boolean;
  tokenType: 'access' | 'refresh';
}
