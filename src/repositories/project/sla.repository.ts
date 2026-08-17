import { Prisma, SLAPolicy, SLATier } from '@prisma/client';

import prisma from '@/lib/prisma';

export type SLAPolicyWithTiers = SLAPolicy & { tiers: SLATier[] };

export class SLARepository {
  /**
   * Get SLA Policy by Tenant ID (with tiers)
   */
  static async getByTenant(
    tenantId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma,
  ): Promise<SLAPolicyWithTiers | null> {
    return db.sLAPolicy.findUnique({
      where: { tenantId },
      include: {
        tiers: {
          orderBy: { priority: 'asc' },
        },
      },
    });
  }

  /**
   * Create SLA Policy with Tiers
   */
  static async create(
    data: Prisma.SLAPolicyUncheckedCreateInput,
    db: Prisma.TransactionClient | typeof prisma = prisma,
  ): Promise<SLAPolicyWithTiers> {
    return db.sLAPolicy.create({
      data,
      include: {
        tiers: {
          orderBy: { priority: 'asc' },
        },
      },
    });
  }

  /**
   * Update SLA Policy
   */
  static async updatePolicy(
    tenantId: string,
    data: Prisma.SLAPolicyUncheckedUpdateInput,
    db: Prisma.TransactionClient | typeof prisma = prisma,
  ): Promise<SLAPolicy> {
    return db.sLAPolicy.update({
      where: { tenantId },
      data,
    });
  }

  /**
   * Update SLA Tier
   */
  static async updateTier(
    tierId: string,
    data: Prisma.SLATierUncheckedUpdateInput,
    db: Prisma.TransactionClient | typeof prisma = prisma,
  ): Promise<SLATier> {
    return db.sLATier.update({
      where: { id: tierId },
      data,
    });
  }

  /**
   * Delete SLA Policy
   */
  static async delete(
    tenantId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma,
  ): Promise<void> {
    await db.sLAPolicy.delete({
      where: { tenantId },
    });
  }
}
