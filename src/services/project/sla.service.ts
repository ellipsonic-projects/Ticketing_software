import { Prisma, TicketPriority } from '@prisma/client';

import { AuditService } from '@/services/audit/audit.service';
import { DbClient, runInTransaction } from '@/services/base/transaction';
import { SLARepository } from '@/repositories/project/sla.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';

// Default SLA configurations by priority
const DEFAULT_SLA_TIERS: Record<
  TicketPriority,
  { responseTimeMinutes: number; resolutionTimeMinutes: number }
> = {
  [TicketPriority.LOW]: { responseTimeMinutes: 480, resolutionTimeMinutes: 5760 }, // 8 hours / 4 days
  [TicketPriority.MEDIUM]: { responseTimeMinutes: 240, resolutionTimeMinutes: 2880 }, // 4 hours / 2 days
  [TicketPriority.HIGH]: { responseTimeMinutes: 120, resolutionTimeMinutes: 1440 }, // 2 hours / 1 day
  [TicketPriority.URGENT]: { responseTimeMinutes: 30, resolutionTimeMinutes: 480 }, // 30 mins / 8 hours
};

export class SLAService {
  /**
   * Get SLA Policy by Tenant ID
   */
  async getPolicy(tenantId: string) {
    return SLARepository.getByTenant(tenantId);
  }

  /**
   * Provision Default SLA Policy for a Tenant (Called during Tenant creation or if missing)
   */
  async provisionDefaultPolicy(tenantId: string, actorId: string, tx?: DbClient) {
    return runInTransaction(async (db) => {
      const existingPolicy = await SLARepository.getByTenant(tenantId);
      if (existingPolicy) {
        return existingPolicy;
      }

      const policy = await SLARepository.create(
        {
          tenantId,
          businessHoursEnabled: true,
          tiers: {
            create: Object.entries(DEFAULT_SLA_TIERS).map(([priority, times]) => ({
              priority: priority as TicketPriority,
              responseTimeMinutes: times.responseTimeMinutes,
              resolutionTimeMinutes: times.resolutionTimeMinutes,
            })),
          },
        },
        db as Prisma.TransactionClient,
      );

      await AuditService.log(
        {
          entity: 'SLAPolicy',
          entityId: policy.id,
          action: 'SLA_CREATED',
          actorId,
          before: null,
          after: policy,
        },
        db as Prisma.TransactionClient,
      );

      return policy;
    }, tx);
  }

  /**
   * Update SLA Tier
   */
  async updateTier(
    tenantId: string,
    priority: TicketPriority,
    data: { responseTimeMinutes: number; resolutionTimeMinutes: number },
    actorId: string,
    tx?: DbClient,
  ) {
    return runInTransaction(async (db) => {
      const policy = await SLARepository.getByTenant(tenantId);
      if (!policy) {
        throw new NotFoundError('SLA Policy not found for tenant');
      }

      const tier = policy.tiers.find((t) => t.priority === priority);
      if (!tier) {
        throw new NotFoundError(`SLA Tier for priority ${priority} not found`);
      }

      if (data.responseTimeMinutes <= 0) {
        throw new ConflictError('Response time must be greater than 0');
      }
      if (data.resolutionTimeMinutes <= data.responseTimeMinutes) {
        throw new ConflictError('Resolution time must be greater than response time');
      }
      if (data.resolutionTimeMinutes > 365 * 24 * 60) {
        throw new ConflictError('Resolution time exceeds maximum allowed limit');
      }

      const updatedTier = await SLARepository.updateTier(
        tier.id,
        {
          responseTimeMinutes: data.responseTimeMinutes,
          resolutionTimeMinutes: data.resolutionTimeMinutes,
        },
        db as Prisma.TransactionClient,
      );

      await AuditService.log(
        {
          entity: 'SLAPolicy',
          entityId: policy.id,
          action: 'SLA_UPDATED',
          actorId,
          before: tier,
          after: updatedTier,
        },
        db as Prisma.TransactionClient,
      );

      return updatedTier;
    }, tx);
  }

  /**
   * Update Global SLA Settings (e.g. business hours)
   */
  async updateSettings(
    tenantId: string,
    data: { businessHoursEnabled: boolean },
    actorId: string,
    tx?: DbClient,
  ) {
    return runInTransaction(async (db) => {
      const policy = await SLARepository.getByTenant(tenantId);
      if (!policy) {
        throw new NotFoundError('SLA Policy not found for tenant');
      }

      const updatedPolicy = await SLARepository.updatePolicy(
        tenantId,
        data,
        db as Prisma.TransactionClient,
      );

      await AuditService.log(
        {
          entity: 'SLAPolicy',
          entityId: policy.id,
          action: 'SLA_UPDATED',
          actorId,
          before: { businessHoursEnabled: policy.businessHoursEnabled },
          after: data,
        },
        db as Prisma.TransactionClient,
      );

      return updatedPolicy;
    }, tx);
  }
}

export const slaService = new SLAService();
