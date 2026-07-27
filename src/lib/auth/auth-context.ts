import { Role } from '@prisma/client';

export interface AuthContext {
  id: string; // The user ID
  tenantId: string | null;
  role: Role;
  sessionId: string;
}
