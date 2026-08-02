import { Holiday, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HolidayRepository {
  /**
   * List all holidays for a project
   */
  static async list(projectId: string): Promise<Holiday[]> {
    return prisma.holiday.findMany({
      where: { projectId },
      orderBy: { holidayDate: 'asc' },
    });
  }

  /**
   * Find a holiday by project and date
   */
  static async findByDate(projectId: string, holidayDate: Date): Promise<Holiday | null> {
    return prisma.holiday.findUnique({
      where: {
        projectId_holidayDate: {
          projectId,
          holidayDate,
        },
      },
    });
  }

  /**
   * Create a holiday
   */
  static async create(
    data: Prisma.HolidayUncheckedCreateInput,
    db: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Holiday> {
    return db.holiday.create({
      data,
    });
  }

  /**
   * Update a holiday
   */
  static async update(
    id: string,
    data: Prisma.HolidayUncheckedUpdateInput,
    db: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Holiday> {
    return db.holiday.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a holiday
   */
  static async delete(
    id: string,
    db: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<void> {
    await db.holiday.delete({
      where: { id },
    });
  }
}
