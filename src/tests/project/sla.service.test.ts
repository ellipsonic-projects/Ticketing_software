/* eslint-disable */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { slaService } from '@/services/project/sla.service';
import { SLARepository } from '@/repositories/project/sla.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';

// Mock dependencies
vi.mock('@/repositories/project/sla.repository');
vi.mock('@/repositories/project/project.repository');
vi.mock('@/services/audit/audit.service');
vi.mock('@/services/base/transaction', () => ({
  runInTransaction: async (cb: (db: unknown) => Promise<unknown>) => cb({}),
}));

describe('SLAService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('upsertPolicy (Validation & Rules)', () => {
    it('should reject if project does not exist', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue(null);

      await expect(
        slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 60, resolutionTimeMinutes: 480, businessHoursEnabled: true }, 'u1')
      ).rejects.toThrow(NotFoundError);
    });

    it('should reject if project is archived', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: new Date() } as never);

      await expect(
        slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 60, resolutionTimeMinutes: 480, businessHoursEnabled: true }, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject if response time is 0 or negative', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);

      await expect(
        slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 0, resolutionTimeMinutes: 480, businessHoursEnabled: true }, 'u1')
      ).rejects.toThrow(ConflictError);
      
      await expect(
        slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: -10, resolutionTimeMinutes: 480, businessHoursEnabled: true }, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject if resolution time is less than or equal to response time', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);

      await expect(
        slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 60, resolutionTimeMinutes: 60, businessHoursEnabled: true }, 'u1')
      ).rejects.toThrow(ConflictError);
      
      await expect(
        slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 60, resolutionTimeMinutes: 30, businessHoursEnabled: true }, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should create policy if valid and does not exist', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);
      vi.mocked(SLARepository.getByProject).mockResolvedValue(null);
      vi.mocked(SLARepository.create).mockResolvedValue({ id: 's1', projectId: 'p1' } as never);

      const result = await slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 60, resolutionTimeMinutes: 480, businessHoursEnabled: true }, 'u1');
      
      expect(result.id).toBe('s1');
      expect(SLARepository.create).toHaveBeenCalled();
      expect(SLARepository.update).not.toHaveBeenCalled();
    });

    it('should update policy if valid and already exists', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);
      vi.mocked(SLARepository.getByProject).mockResolvedValue({ id: 's1' } as never);
      vi.mocked(SLARepository.update).mockResolvedValue({ id: 's1', projectId: 'p1' } as never);

      const result = await slaService.upsertPolicy('t1', 'p1', { responseTimeMinutes: 60, resolutionTimeMinutes: 480, businessHoursEnabled: true }, 'u1');
      
      expect(result.id).toBe('s1');
      expect(SLARepository.update).toHaveBeenCalled();
      expect(SLARepository.create).not.toHaveBeenCalled();
    });
  });
});
