import { PrismaClient, Prisma, BusinessHours } from '@prisma/client';

const prisma = new PrismaClient();

export class BusinessHoursRepository {
  /**
   * Get Business Hours by Project ID (returns all days)
   */
  static async getByProject(projectId: string): Promise<BusinessHours[]> {
    return prisma.businessHours.findMany({
      where: { projectId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  /**
   * Replace the entire weekly schedule for a project in a transaction
   */
  static async replaceWeekSchedule(
    projectId: string,
    schedule: Prisma.BusinessHoursCreateManyInput[],
    db: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<BusinessHours[]> {
    // 1. Delete all existing business hours for this project
    await db.businessHours.deleteMany({
      where: { projectId },
    });

    // 2. Insert the new weekly schedule
    await db.businessHours.createMany({
      data: schedule,
    });

    // 3. Return the newly created records
    return db.businessHours.findMany({
      where: { projectId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }
}
