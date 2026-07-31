import { Prisma, PrismaClient } from '@prisma/client';
import { HolidayRepository } from '@/repositories/project/holiday.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { AuditService } from '@/services/audit/audit.service';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';
import { runInTransaction, DbClient } from '@/services/base/transaction';

export class HolidayService {
  /**
   * List all holidays for a project
   */
  async list(tenantId: string, projectId: string) {
    const project = await ProjectRepository.findById(tenantId, projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return HolidayRepository.list(projectId);
  }

  /**
   * Create a holiday
   */
  async create(
    tenantId: string,
    projectId: string,
    data: { name: string; holidayDate: string | Date },
    actorId: string,
    tx?: DbClient
  ) {
    return runInTransaction(async (db) => {
      // 1. Validate project and tenant
      const project = await ProjectRepository.findById(tenantId, projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      if (project.archivedAt) {
        throw new ConflictError('Cannot configure holidays for an archived project');
      }

      // 2. Validate duplicate date
      const dateObj = new Date(data.holidayDate);
      // Ensure the time component is zeroed out for accurate duplicate checks since it's @db.Date
      dateObj.setUTCHours(0, 0, 0, 0);

      const existing = await HolidayRepository.findByDate(projectId, dateObj);
      if (existing) {
        throw new ConflictError('A holiday already exists on this date for this project');
      }

      // 3. Create Holiday
      const holiday = await HolidayRepository.create(
        {
          projectId,
          tenantId,
          name: data.name,
          holidayDate: dateObj,
        },
        db as Prisma.TransactionClient
      );

      // 4. Audit Log
      await AuditService.log({
        entity: 'Holiday',
        entityId: holiday.id,
        action: 'HOLIDAY_CREATED',
        actorId,
        after: holiday,
      }, db as Prisma.TransactionClient);

      return holiday;
    }, tx);
  }

  /**
   * Update a holiday
   */
  async update(
    tenantId: string,
    projectId: string,
    holidayId: string,
    data: { name?: string; holidayDate?: string | Date },
    actorId: string,
    tx?: DbClient
  ) {
    return runInTransaction(async (db) => {
      // 1. Validate project
      const project = await ProjectRepository.findById(tenantId, projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      if (project.archivedAt) {
        throw new ConflictError('Cannot configure holidays for an archived project');
      }

      // 2. Validate Holiday existence
      // Since findUnique on Holiday uses ID, we don't have a direct getById in repository yet.
      // Let's add it or use findUnique here directly.
      const existingHoliday = await (db as PrismaClient).holiday.findUnique({
        where: { id: holidayId, projectId },
      });

      if (!existingHoliday) {
        throw new NotFoundError('Holiday not found');
      }

      // 3. Validate duplicate date if date is changing
      let newDateObj: Date | undefined;
      if (data.holidayDate) {
        newDateObj = new Date(data.holidayDate);
        newDateObj.setUTCHours(0, 0, 0, 0);

        if (newDateObj.getTime() !== existingHoliday.holidayDate.getTime()) {
          const duplicate = await HolidayRepository.findByDate(projectId, newDateObj);
          if (duplicate) {
            throw new ConflictError('A holiday already exists on this date for this project');
          }
        }
      }

      // 4. Update Holiday
      const updatedHoliday = await HolidayRepository.update(
        holidayId,
        {
          name: data.name ?? existingHoliday.name,
          holidayDate: newDateObj ?? existingHoliday.holidayDate,
        },
        db as Prisma.TransactionClient
      );

      // 5. Audit Log
      await AuditService.log({
        entity: 'Holiday',
        entityId: holidayId,
        action: 'HOLIDAY_UPDATED',
        actorId,
        before: existingHoliday,
        after: updatedHoliday,
      }, db as Prisma.TransactionClient);

      return updatedHoliday;
    }, tx);
  }

  /**
   * Delete a holiday
   */
  async delete(
    tenantId: string,
    projectId: string,
    holidayId: string,
    actorId: string,
    tx?: DbClient
  ) {
    return runInTransaction(async (db) => {
      // 1. Validate project
      const project = await ProjectRepository.findById(tenantId, projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      if (project.archivedAt) {
        throw new ConflictError('Cannot configure holidays for an archived project');
      }

      // 2. Validate Holiday
      const existingHoliday = await (db as PrismaClient).holiday.findUnique({
        where: { id: holidayId, projectId },
      });

      if (!existingHoliday) {
        throw new NotFoundError('Holiday not found');
      }

      // 3. Delete Holiday
      await HolidayRepository.delete(holidayId, db as Prisma.TransactionClient);

      // 4. Audit Log
      await AuditService.log({
        entity: 'Holiday',
        entityId: holidayId,
        action: 'HOLIDAY_DELETED',
        actorId,
        before: existingHoliday,
      }, db as Prisma.TransactionClient);
    }, tx);
  }
}

export const holidayService = new HolidayService();
