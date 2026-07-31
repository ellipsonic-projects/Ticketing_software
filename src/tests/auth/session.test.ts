/* eslint-disable */
import { Session } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionService } from '@/services/auth/session.service';
import { authRepository } from '@/repositories/auth/auth.repository';
import * as passwordHash from '@/lib/auth/password';
import {
  InactiveAccountError,
  InactiveTenantError,
  InvalidRefreshTokenError,
  SessionExpiredError,
  SessionRevokedError,
} from '@/lib/errors/auth-errors';
import { clock } from '@/lib/time';

vi.mock('@/repositories/auth/auth.repository');
vi.mock('@/lib/auth/password');

describe('Session Service', () => {
  const validSessionId = 'session-valid';
  const revokedSessionId = 'session-revoked';
  const expiredSessionId = 'session-expired';
  const inactiveUserSessionId = 'session-inactive-user';
  const inactiveTenantSessionId = 'session-inactive-tenant';
  const adminInactiveTenantSessionId = 'session-admin-inactive-tenant';

  const mockValidSession = {
    id: validSessionId,
    userId: 'user-1',
    expiresAt: new Date('2027-01-01'),
    revokedAt: null,
    refreshTokenHash: 'hashed-token',
    user: {
      status: 'ACTIVE',
      role: 'ENGINEER',
      tenant: { status: 'ACTIVE' },
    },
  };

  const mockRevokedSession = {
    ...mockValidSession,
    id: revokedSessionId,
    revokedAt: new Date('2026-01-01'),
  };

  const mockExpiredSession = {
    ...mockValidSession,
    id: expiredSessionId,
    expiresAt: new Date('2025-01-01'),
  };

  const mockInactiveUserSession = {
    ...mockValidSession,
    id: inactiveUserSessionId,
    user: { ...mockValidSession.user, status: 'INACTIVE' },
  };

  const mockInactiveTenantSession = {
    ...mockValidSession,
    id: inactiveTenantSessionId,
    user: { ...mockValidSession.user, tenant: { status: 'INACTIVE' } },
  };

  const mockAdminInactiveTenantSession = {
    ...mockValidSession,
    id: adminInactiveTenantSessionId,
    user: { ...mockValidSession.user, role: 'PLATFORM_ADMIN', tenant: { status: 'INACTIVE' } },
  };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(clock, 'now').mockReturnValue(new Date('2026-07-26T12:00:00Z'));

    vi.mocked(authRepository.findSessionWithContext).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (id: string): Promise<any> => {
        if (id === validSessionId) return mockValidSession;
        if (id === revokedSessionId) return mockRevokedSession;
        if (id === expiredSessionId) return mockExpiredSession;
        if (id === inactiveUserSessionId) return mockInactiveUserSession;
        if (id === inactiveTenantSessionId) return mockInactiveTenantSession;
        if (id === adminInactiveTenantSessionId) return mockAdminInactiveTenantSession;
        return null;
      },
    );

    vi.mocked(passwordHash.verify).mockImplementation(async (raw, hash) => {
      return raw === 'valid-raw-token' && hash === 'hashed-token';
    });
  });

  it('should validate an active session', async () => {
    const session = await sessionService.validateSession(validSessionId);
    expect(session).toBeDefined();
    expect(session?.id).toBe(validSessionId);
  });

  it('should reject a revoked session', async () => {
    await expect(sessionService.validateSession(revokedSessionId)).rejects.toThrow(
      SessionRevokedError,
    );
  });

  it('should reject an expired session', async () => {
    await expect(sessionService.validateSession(expiredSessionId)).rejects.toThrow(
      SessionExpiredError,
    );
  });

  it('should reject an inactive user', async () => {
    await expect(sessionService.validateSession(inactiveUserSessionId)).rejects.toThrow(
      InactiveAccountError,
    );
  });

  it('should reject an inactive tenant', async () => {
    await expect(sessionService.validateSession(inactiveTenantSessionId)).rejects.toThrow(
      InactiveTenantError,
    );
  });

  it('should allow a super admin even if tenant is inactive', async () => {
    const session = await sessionService.validateSession(adminInactiveTenantSessionId);
    expect(session).toBeDefined();
  });

  it('should reject an invalid refresh token cryptographic hash', async () => {
    await expect(
      sessionService.validateRefreshToken(validSessionId, 'invalid-raw-token'),
    ).rejects.toThrow(InvalidRefreshTokenError);
  });

  it('should validate a correct refresh token cryptographic hash', async () => {
    const session = await sessionService.validateRefreshToken(validSessionId, 'valid-raw-token');
    expect(session).toBeDefined();
  });

  it('should revoke a session using the repository', async () => {
    await sessionService.revokeSession(validSessionId);
    expect(authRepository.revokeSession).toHaveBeenCalledWith(validSessionId, clock.now());
  });

  it('should revoke all user sessions using the repository', async () => {
    await sessionService.revokeAllUserSessions('user-1');
    expect(authRepository.revokeAllUserSessions).toHaveBeenCalledWith('user-1', clock.now());
  });

  it('should cleanup expired sessions using the repository', async () => {
    await sessionService.cleanupExpiredSessions();
    expect(authRepository.deleteExpiredSessions).toHaveBeenCalledWith(clock.now());
  });
});
