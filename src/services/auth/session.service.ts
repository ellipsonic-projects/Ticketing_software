import { Session } from '@prisma/client';

import { authRepository } from '@/repositories/auth/auth.repository';
import * as passwordHash from '@/lib/auth/password';
import {
  InactiveAccountError,
  InactiveTenantError,
  InvalidRefreshTokenError,
  SessionExpiredError,
  SessionRevokedError,
} from '@/lib/errors/auth-errors';
import prisma from '@/lib/prisma';
import { clock } from '@/lib/time';

export class SessionService {
  /**
   * Validates a session by checking expiration and revocation.
   */
  async validateSession(sessionId: string) {
    const session = await authRepository.findSessionWithContext(sessionId);
    if (!session) return null;

    if (session.revokedAt) {
      throw new SessionRevokedError();
    }

    if (session.expiresAt < clock.now()) {
      throw new SessionExpiredError();
    }

    const { user } = session;
    if (user.status !== 'ACTIVE') {
      throw new InactiveAccountError();
    }

    if (user.role !== 'PLATFORM_ADMIN' && user.tenant) {
      if (user.tenant.status !== 'ACTIVE') {
        throw new InactiveTenantError();
      }
    }

    return session;
  }

  /**
   * Revokes a specific session.
   */
  async revokeSession(sessionId: string): Promise<void> {
    await authRepository.revokeSession(sessionId, clock.now());
  }

  /**
   * Revokes all active sessions for a user.
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    await authRepository.revokeAllUserSessions(userId, clock.now());
  }

  /**
   * Deletes sessions that have expired past the given date.
   */
  async cleanupExpiredSessions(): Promise<void> {
    await authRepository.deleteExpiredSessions(clock.now());
  }

  /**
   * Validates a raw refresh token cryptographically before allowing rotation.
   */
  async validateRefreshToken(sessionId: string, rawRefreshToken: string) {
    const session = await this.validateSession(sessionId);
    if (!session) throw new InvalidRefreshTokenError();

    const isValid = await passwordHash.verify(rawRefreshToken, session.refreshTokenHash);
    if (!isValid) throw new InvalidRefreshTokenError();

    return session;
  }

  /**
   * Rotates a refresh token by hashing the new token and returning the updated session.
   */
  async rotateRefreshToken(
    sessionId: string,
    oldRefreshToken: string,
    newRefreshToken: string,
    newExpiresAt: Date,
  ): Promise<Session | null> {
    const session = await this.validateRefreshToken(sessionId, oldRefreshToken);

    const hashed = await passwordHash.hash(newRefreshToken);

    return prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: hashed,
        expiresAt: newExpiresAt,
      },
    });
  }
}

export const sessionService = new SessionService();
