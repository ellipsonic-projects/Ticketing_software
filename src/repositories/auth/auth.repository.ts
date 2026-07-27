import { Session, User } from '@prisma/client';

import { prisma } from '@/lib/db';

export class AuthRepository {
  /**
   * Generic internal user lookup
   */
  async findInternalUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findPlatformAdminByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        role: 'PLATFORM_ADMIN',
      },
    });
  }

  async findClientAccountByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        role: 'ENGINEER',
      },
    });
  }

  async createSession(data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    return prisma.session.create({
      data,
    });
  }

  async findSession(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  async findSessionWithContext(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        user: {
          include: { tenant: true },
        },
      },
    });
  }

  async revokeSession(id: string, revokedAt: Date): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: { revokedAt },
    });
  }

  async revokeAllUserSessions(userId: string, revokedAt: Date): Promise<number> {
    const result = await prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt },
    });
    return result.count;
  }

  async deleteExpiredSessions(now: Date): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });
    return result.count;
  }
}

export const authRepository = new AuthRepository();
