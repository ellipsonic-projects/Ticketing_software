import crypto from 'crypto';

import { env } from '@/config/env';
import { Prisma } from '@prisma/client';

import { AuditService } from '@/services/audit/audit.service';
import { emailService } from '@/services/email/email.service';
import { authRepository } from '@/repositories/auth/auth.repository';
import { jwtService } from '@/lib/auth/jwt';
import * as passwordHash from '@/lib/auth/password';
import {
  InactiveAccountError,
  InvalidCredentialsError,
  InvalidTokenError,
  MissingTokenError,
} from '@/lib/errors/auth-errors';
import prisma from '@/lib/prisma';
import { clock } from '@/lib/time';

import { sessionService } from './session.service';

// ---------------------------------------------------------------------------
// Module-level helpers
// ---------------------------------------------------------------------------

/** SHA-256 hash of a raw token string (deterministic, suitable for DB lookup). */
function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/** Resolved application base URL. */
const APP_URL = env.NEXT_PUBLIC_APP_URL;

/** Session TTL: 7 days in milliseconds. */
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Interface for rate limiting, implementation deferred to Sprint 1.3
 */
export interface RateLimiter {
  checkLimit(key: string, limit: number, windowSeconds: number): Promise<void>;
}

export class AuthService {
  async login(email: string, pass: string, ipAddress?: string, userAgent?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findInternalUserByEmail(normalizedEmail);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.status !== 'ACTIVE') {
      throw new InactiveAccountError();
    }

    const isValid = await passwordHash.verify(pass, user.password);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    // 1. Create a raw refresh token
    const rawRefreshToken = crypto.randomBytes(64).toString('hex');

    // 2. Hash it
    const refreshTokenHash = await passwordHash.hash(rawRefreshToken);

    // 3. Create session with hash
    const expiresAt = new Date(clock.now().getTime() + SESSION_TTL_MS);
    const session = await authRepository.createSession({
      userId: user.id,
      tenantId: user.tenantId,
      refreshTokenHash,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
      revokedAt: null,
    });

    const jwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      sessionId: session.id,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      clientId: user.clientId || undefined,
    };

    // 4. Generate Access Token JWT
    const accessToken = jwtService.generateAccessToken(jwtPayload);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken: `${session.id}:${rawRefreshToken}`,
      },
    };
  }

  async logout(sessionId: string) {
    await sessionService.revokeSession(sessionId);
  }

  async refresh(sessionId: string, rawRefreshToken: string) {
    // Session validation and rotation
    const newRawRefreshToken = crypto.randomBytes(64).toString('hex');
    const newExpiresAt = new Date(clock.now().getTime() + SESSION_TTL_MS);

    const session = await sessionService.rotateRefreshToken(
      sessionId,
      rawRefreshToken,
      newRawRefreshToken,
      newExpiresAt,
    );

    if (!session) {
      throw new InvalidTokenError('Could not rotate session');
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    if (!user) throw new InvalidCredentialsError();

    const jwtPayload = {
      sub: session.userId,
      tenantId: user.tenantId,
      sessionId: session.id,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      clientId: user.clientId || undefined,
    };

    const accessToken = jwtService.generateAccessToken(jwtPayload);

    return {
      tokens: {
        accessToken,
        refreshToken: `${session.id}:${newRawRefreshToken}`,
      },
    };
  }

  async authenticate(accessToken: string) {
    if (!accessToken) throw new MissingTokenError();
    const payload = jwtService.verifyAccessToken(accessToken);
    await sessionService.validateSession(payload.sessionId);
    return payload;
  }

  async forgotPassword(email: string) {
    const user = await authRepository.findInternalUserByEmail(email);
    if (!user) return; // Silent fail for security

    const rawToken = crypto.randomBytes(32).toString('hex');
    // SHA-256 is used here (not Argon2) because we need a deterministic hash for DB lookup.
    // This is secure because the raw token has 256 bits of entropy.
    const tokenHash = hashToken(rawToken);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(clock.now().getTime() + 15 * 60 * 1000), // 15 mins
      },
    });

    await emailService.sendPasswordReset(user.email, rawToken, APP_URL);

    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      actorId: user.id,
    });

    if (process.env.NODE_ENV !== 'production') {
      return `${APP_URL}/auth/reset-password?token=${rawToken}`;
    }
  }

  async acceptInvitation(rawToken: string, newPass: string) {
    const tokenHash = hashToken(rawToken);

    const user = await prisma.user.findUnique({
      where: { invitationTokenHash: tokenHash },
    });

    if (
      !user ||
      user.status !== 'INVITED' ||
      !user.invitationExpiresAt ||
      user.invitationExpiresAt < clock.now()
    ) {
      throw new InvalidCredentialsError('Invalid or expired invitation token');
    }

    const hashedNew = await passwordHash.hash(newPass);

    const updates: Prisma.PrismaPromise<unknown>[] = [
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedNew,
          status: 'ACTIVE',
          invitationTokenHash: null,
          invitationExpiresAt: null,
          activatedAt: clock.now(),
        },
      }),
    ];

    if (user.role === 'TENANT_ADMIN') {
      updates.push(
        prisma.tenant.update({
          where: { id: user.tenantId },
          data: { status: 'ACTIVE' },
        }),
      );
    } else if (user.role === 'CLIENT') {
      // Find the client associated with this email and activate it
      const client = await prisma.client.findFirst({
        where: { tenantId: user.tenantId, email: user.email },
      });
      if (client) {
        updates.push(
          prisma.client.update({
            where: { id: client.id },
            data: { status: 'ACTIVE' },
          }),
        );
      }
    }

    await prisma.$transaction(updates);

    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'INVITATION_ACCEPTED',
      actorId: user.id,
    });

    await emailService.sendWelcome(user.email, APP_URL);
  }

  async resendInvitation(email: string, actorId: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.status !== 'INVITED') {
      return; // Silent fail — don't leak user existence
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        invitationTokenHash: tokenHash,
        invitationExpiresAt: expiresAt,
        invitedAt: new Date(),
      },
    });

    await emailService.sendInvitation(user.email, rawToken, APP_URL);

    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'INVITATION_RESENT',
      actorId,
    });
  }

  async resetPassword(rawToken: string, newPass: string) {
    const tokenHash = hashToken(rawToken);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.expiresAt < clock.now()) {
      throw new InvalidCredentialsError('Invalid or expired reset token');
    }

    const hashedNew = await passwordHash.hash(newPass);

    // Transaction: update password and delete the used token atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedNew },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    await AuditService.log({
      entity: 'USER',
      entityId: resetToken.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      actorId: resetToken.userId,
    });

    await this.invalidateSessions(resetToken.userId);
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new InvalidCredentialsError();

    const isValid = await passwordHash.verify(oldPass, user.password);
    if (!isValid) throw new InvalidCredentialsError('Invalid current password');

    const hashedNew = await passwordHash.hash(newPass);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNew,
        mustChangePassword: false,
      },
    });

    await AuditService.log({
      entity: 'USER',
      entityId: userId,
      action: 'CHANGE_PASSWORD',
      actorId: userId,
    });

    await emailService.sendPasswordChanged(user.email);
    await this.invalidateSessions(userId);
  }

  async invalidateSessions(userId: string) {
    await sessionService.revokeAllUserSessions(userId);
  }
}

export const authService = new AuthService();
