import crypto from 'crypto';

import { env } from '@/config/env';

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
import { clock } from '@/lib/time';

import { sessionService } from './session.service';

/**
 * Interface for rate limiting, implementation deferred to Sprint 1.3
 */
export interface RateLimiter {
  checkLimit(key: string, limit: number, windowSeconds: number): Promise<void>;
}

export class AuthService {
  async login(email: string, pass: string, ipAddress?: string, userAgent?: string) {
    const user = await authRepository.findInternalUserByEmail(email);
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

    // 3. Create Session with hash
    const expiresAt = new Date(clock.now().getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days (matching config)
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
    const newExpiresAt = new Date(clock.now().getTime() + 7 * 24 * 60 * 60 * 1000);

    const session = await sessionService.rotateRefreshToken(
      sessionId,
      rawRefreshToken,
      newRawRefreshToken,
      newExpiresAt,
    );

    if (!session) {
      throw new InvalidTokenError('Could not rotate session');
    }

    const { prisma } = await import('@/lib/db');
    const user = await prisma.user.findUnique({ where: { id: session.userId } }); // Need role etc

    if (!user) throw new InvalidCredentialsError();

    const jwtPayload = {
      sub: session.userId,
      tenantId: session.tenantId,
      sessionId: session.id,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
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
    // We use SHA-256 here instead of Argon2 because we need a deterministic hash for DB lookup.
    // This is secure because the raw token has 256 bits of entropy.
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const { prisma } = await import('@/lib/db');
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(clock.now().getTime() + 15 * 60 * 1000), // 15 mins
      },
    });

    // Use env NEXT_PUBLIC_APP_URL
    const appUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await emailService.sendPasswordReset(user.email, rawToken, appUrl);

    const { AuditService } = await import('@/services/audit/audit.service');
    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      actorId: user.id,
    });

    if (process.env.NODE_ENV !== 'production') {
      const resetLink = `${appUrl}/auth/reset-password?token=${rawToken}`;
      return resetLink;
    }
  }

  async acceptInvitation(rawToken: string, newPass: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const { prisma } = await import('@/lib/db');

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

    await prisma.$transaction([
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
      prisma.tenant.update({
        where: { id: user.tenantId },
        data: {
          status: 'ACTIVE',
        },
      }),
    ]);

    const { AuditService } = await import('@/services/audit/audit.service');
    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'INVITATION_ACCEPTED',
      actorId: user.id,
    });

    const appUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await emailService.sendWelcome(user.email, appUrl);
  }

  async resendInvitation(email: string, actorId: string) {
    const { prisma } = await import('@/lib/db');
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.status !== 'INVITED') {
      return; // Silent fail
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        invitationTokenHash: tokenHash,
        invitationExpiresAt: expiresAt,
        invitedAt: new Date(),
      },
    });

    const appUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await emailService.sendInvitation(user.email, rawToken, appUrl);

    const { AuditService } = await import('@/services/audit/audit.service');
    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'INVITATION_RESENT',
      actorId: actorId,
    });
  }

  async resetPassword(rawToken: string, newPass: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const { prisma } = await import('@/lib/db');

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.expiresAt < clock.now()) {
      throw new InvalidCredentialsError('Invalid or expired reset token');
    }

    const hashedNew = await passwordHash.hash(newPass);

    // Transaction to update password and delete token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedNew },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    const { AuditService } = await import('@/services/audit/audit.service');
    await AuditService.log({
      entity: 'USER',
      entityId: resetToken.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      actorId: resetToken.userId,
    });

    await this.invalidateSessions(resetToken.userId);
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const { prisma } = await import('@/lib/db');
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

    const { AuditService } = await import('@/services/audit/audit.service');
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
