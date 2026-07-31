import { PrismaClient, Prisma, SLAPolicy } from '@prisma/client';

const prisma = new PrismaClient();

export class SLARepository {
  /**
   * Get SLA Policy by Project ID
   */
  static async getByProject(projectId: string): Promise<SLAPolicy | null> {
    return prisma.sLAPolicy.findUnique({
      where: { projectId },
    });
  }

  /**
   * Create SLA Policy
   */
  static async create(
    data: Prisma.SLAPolicyUncheckedCreateInput,
    db: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<SLAPolicy> {
    return db.sLAPolicy.create({
      data,
    });
  }

  /**
   * Update SLA Policy
   */
  static async update(
    projectId: string,
    data: Prisma.SLAPolicyUncheckedUpdateInput,
    db: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<SLAPolicy> {
    return db.sLAPolicy.update({
      where: { projectId },
      data,
    });
  }

  /**
   * Check if an SLA Policy exists for a project
   */
  static async exists(projectId: string): Promise<boolean> {
    const count = await prisma.sLAPolicy.count({
      where: { projectId },
    });
    return count > 0;
  }

  /**
   * Delete SLA Policy
   */
  static async delete(
    projectId: string,
    db: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<void> {
    await db.sLAPolicy.delete({
      where: { projectId },
    });
  }
}
