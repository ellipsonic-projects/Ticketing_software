import { Prisma } from '@prisma/client';

import { AuditService } from '@/services/audit/audit.service';
import { DbClient, runInTransaction } from '@/services/base/transaction';
import { BusinessHoursRepository } from '@/repositories/project/business-hours.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';

export interface BusinessHourInput {
  dayOfWeek: number;
  isOpen: boolean;
  startTime?: string | null;
  endTime?: string | null;
  timezone?: string | null;
}

export class BusinessHoursService {
  /**
   * Get Business Hours by Project ID
   */
  async getByProject(tenantId: string, projectId: string) {
    const project = await ProjectRepository.findById(tenantId, projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return BusinessHoursRepository.getByProject(projectId);
  }

  /**
   * Replace the weekly schedule for a project
   */
  async replaceSchedule(
    tenantId: string,
    projectId: string,
    schedule: BusinessHourInput[],
    actorId: string,
    tx?: DbClient,
  ) {
    return runInTransaction(async (db) => {
      // 1. Validate project and tenant
      const project = await ProjectRepository.findById(tenantId, projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      if (project.archivedAt) {
        throw new ConflictError('Cannot configure business hours for an archived project');
      }

      // 2. Validate input (must have 7 days, no duplicates, valid times)
      if (schedule.length !== 7) {
        throw new ConflictError('Schedule must contain exactly 7 days');
      }

      const seenDays = new Set<number>();
      for (const day of schedule) {
        if (day.dayOfWeek < 0 || day.dayOfWeek > 6) {
          throw new ConflictError(`Invalid day of week: ${day.dayOfWeek}`);
        }
        if (seenDays.has(day.dayOfWeek)) {
          throw new ConflictError(`Duplicate day of week found: ${day.dayOfWeek}`);
        }
        seenDays.add(day.dayOfWeek);

        if (day.isOpen) {
          if (!day.startTime || !day.endTime) {
            throw new ConflictError(
              `Start and end times are required when day ${day.dayOfWeek} is open`,
            );
          }
          // Validate time format and start < end
          // For simplicity in this implementation, assume startTime and endTime are valid DateTime objects mapped via string inputs
          // Actually, we changed the schema to `DateTime @db.Time(0)`.
          // We must parse the time string 'HH:mm' into a mock Date object for Prisma to store it correctly in a Time column.
          const start = new Date(`1970-01-01T${day.startTime}:00Z`);
          const end = new Date(`1970-01-01T${day.endTime}:00Z`);
          if (start >= end) {
            throw new ConflictError(`Start time must be before end time on day ${day.dayOfWeek}`);
          }
        }
      }

      // 3. Format payload
      const payload: Prisma.BusinessHoursCreateManyInput[] = schedule.map((day) => {
        let startTime = null;
        let endTime = null;
        if (day.isOpen && day.startTime && day.endTime) {
          startTime = new Date(`1970-01-01T${day.startTime}:00Z`);
          endTime = new Date(`1970-01-01T${day.endTime}:00Z`);
        }
        return {
          projectId,
          tenantId,
          dayOfWeek: day.dayOfWeek,
          isOpen: day.isOpen,
          startTime,
          endTime,
          timezone: day.timezone || null,
        };
      });

      // 4. Get previous schedule for audit logging
      const existingSchedule = await BusinessHoursRepository.getByProject(projectId);

      // 5. Replace Schedule
      const newSchedule = await BusinessHoursRepository.replaceWeekSchedule(
        projectId,
        payload,
        db as Prisma.TransactionClient,
      );

      // 6. Audit Log
      await AuditService.log(
        {
          entity: 'BusinessHours',
          entityId: projectId, // Using projectId since it's a collection of records
          action: 'BUSINESS_HOURS_UPDATED',
          actorId,
          before: existingSchedule,
          after: newSchedule,
        },
        db as Prisma.TransactionClient,
      );

      return newSchedule;
    }, tx);
  }
}

export const businessHoursService = new BusinessHoursService();
