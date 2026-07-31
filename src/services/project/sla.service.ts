import { Prisma } from '@prisma/client';
import { SLARepository } from '@/repositories/project/sla.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { AuditService } from '@/services/audit/audit.service';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';
import { runInTransaction, DbClient } from '@/services/base/transaction';

export class SLAService {
  /**
   * Get SLA Policy by Project ID
   */
  async getPolicy(tenantId: string, projectId: string) {
    const project = await ProjectRepository.findById(tenantId, projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return SLARepository.getByProject(projectId);
  }

  /**
   * Upsert SLA Policy (Creates if it doesn't exist, updates if it does)
   */
  async upsertPolicy(
    tenantId: string,
    projectId: string,
    data: {
      responseTimeMinutes: number;
      resolutionTimeMinutes: number;
      businessHoursEnabled: boolean;
    },
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
        throw new ConflictError('Cannot configure SLA for an archived project');
      }

      // 2. Validate SLA rules
      if (data.responseTimeMinutes <= 0) {
        throw new ConflictError('Response time must be greater than 0');
      }
      if (data.resolutionTimeMinutes <= data.responseTimeMinutes) {
        throw new ConflictError('Resolution time must be greater than response time');
      }
      // Sanity limit: 365 days
      if (data.resolutionTimeMinutes > 365 * 24 * 60) {
        throw new ConflictError('Resolution time exceeds maximum allowed limit (365 days)');
      }

      // 3. Check if exists
      const existingPolicy = await SLARepository.getByProject(projectId);

      let policy;
      let action: 'SLA_CREATED' | 'SLA_UPDATED';

      if (existingPolicy) {
        policy = await SLARepository.update(
          projectId,
          {
            responseTimeMinutes: data.responseTimeMinutes,
            resolutionTimeMinutes: data.resolutionTimeMinutes,
            businessHoursEnabled: data.businessHoursEnabled,
          },
          db as Prisma.TransactionClient
        );
        action = 'SLA_UPDATED';
      } else {
        policy = await SLARepository.create(
          {
            projectId,
            tenantId,
            responseTimeMinutes: data.responseTimeMinutes,
            resolutionTimeMinutes: data.resolutionTimeMinutes,
            businessHoursEnabled: data.businessHoursEnabled,
          },
          db as Prisma.TransactionClient
        );
        action = 'SLA_CREATED';
      }

      // 4. Audit Log
      await AuditService.log({
        entity: 'SLAPolicy',
        entityId: policy.id,
        action,
        actorId,
        before: existingPolicy || null,
        after: policy,
      }, db as Prisma.TransactionClient);

      return policy;
    }, tx);
  }
}

export const slaService = new SLAService();
