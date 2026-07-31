/* eslint-disable */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { businessHoursService } from '@/services/project/business-hours.service';
import { BusinessHoursRepository } from '@/repositories/project/business-hours.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';

// Mock dependencies
vi.mock('@/repositories/project/business-hours.repository');
vi.mock('@/repositories/project/project.repository');
vi.mock('@/services/audit/audit.service');
vi.mock('@/services/base/transaction', () => ({
  runInTransaction: async (cb: (db: unknown) => Promise<unknown>) => cb({}),
}));

describe('BusinessHoursService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('replaceSchedule (Validation & Rules)', () => {
    it('should reject if project does not exist', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue(null);

      await expect(
        businessHoursService.replaceSchedule('t1', 'p1', [], 'u1')
      ).rejects.toThrow(NotFoundError);
    });

    it('should reject if project is archived', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: new Date() } as never);

      await expect(
        businessHoursService.replaceSchedule('t1', 'p1', [], 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject if schedule does not have exactly 7 days', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);

      await expect(
        businessHoursService.replaceSchedule('t1', 'p1', [{ dayOfWeek: 1, isOpen: true, startTime: '09:00', endTime: '17:00' }], 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject duplicate days', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);

      const invalidSchedule = Array(7).fill({ dayOfWeek: 1, isOpen: false });

      await expect(
        businessHoursService.replaceSchedule('t1', 'p1', invalidSchedule, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject open days missing start or end time', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);

      const invalidSchedule = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        isOpen: i === 1, // Monday is open, but no time provided
      }));

      await expect(
        businessHoursService.replaceSchedule('t1', 'p1', invalidSchedule, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject if start time is after end time', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);

      const invalidSchedule = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        isOpen: i === 1, // Monday is open
        startTime: i === 1 ? '17:00' : undefined,
        endTime: i === 1 ? '09:00' : undefined,
      }));

      await expect(
        businessHoursService.replaceSchedule('t1', 'p1', invalidSchedule, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should successfully save valid schedule', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);
      vi.mocked(BusinessHoursRepository.replaceWeekSchedule).mockResolvedValue([] as never);

      const validSchedule = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        isOpen: i > 0 && i < 6, // Open Mon-Fri
        startTime: i > 0 && i < 6 ? '09:00' : null,
        endTime: i > 0 && i < 6 ? '17:00' : null,
      }));

      await businessHoursService.replaceSchedule('t1', 'p1', validSchedule, 'u1');

      expect(BusinessHoursRepository.replaceWeekSchedule).toHaveBeenCalled();
    });
  });
});
