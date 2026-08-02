import { Prisma, PrismaClient, SLAPolicy, SLATier } from '@prisma/client';

const prisma = new PrismaClient();

export type SLAPolicyWithTiers = SLAPolicy & { tiers: SLATier[] };

export class SLARepository {
  /**
   * Get SLA Policy by Tenant ID (with tiers)
   */
  static async getByTenant(tenantId: string): Promise<SLAPolicyWithTiers | null> {
    return prisma.sLAPolicy.findUnique({
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
    db: Prisma.TransactionClient | PrismaClient = prisma,
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
    db: Prisma.TransactionClient | PrismaClient = prisma,
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
    db: Prisma.TransactionClient | PrismaClient = prisma,
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
    db: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<void> {
    await db.sLAPolicy.delete({
      where: { tenantId },
    });
  }
}
