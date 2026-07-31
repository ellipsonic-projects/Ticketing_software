/* eslint-disable */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { holidayService } from '@/services/project/holiday.service';
import { HolidayRepository } from '@/repositories/project/holiday.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';

// Mock dependencies
vi.mock('@/repositories/project/holiday.repository');
vi.mock('@/repositories/project/project.repository');
vi.mock('@/services/audit/audit.service');
vi.mock('@/services/base/transaction', () => ({
  runInTransaction: async (cb: (db: unknown) => Promise<unknown>) => cb({
    holiday: {
      findUnique: vi.fn().mockResolvedValue({ id: 'h1', projectId: 'p1', holidayDate: new Date('2027-01-01T00:00:00Z') }),
    }
  }),
}));

describe('HolidayService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('create (Validation & Rules)', () => {
    it('should reject if project does not exist', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue(null);

      await expect(
        holidayService.create('t1', 'p1', { name: 'New Year', holidayDate: '2027-01-01' }, 'u1')
      ).rejects.toThrow(NotFoundError);
    });

    it('should reject if project is archived', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: new Date() } as never);

      await expect(
        holidayService.create('t1', 'p1', { name: 'New Year', holidayDate: '2027-01-01' }, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should reject duplicate dates for the same project', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);
      vi.mocked(HolidayRepository.findByDate).mockResolvedValue({ id: 'existing-h1' } as never);

      await expect(
        holidayService.create('t1', 'p1', { name: 'New Year', holidayDate: '2027-01-01' }, 'u1')
      ).rejects.toThrow(ConflictError);
    });

    it('should successfully create a new holiday', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: null } as never);
      vi.mocked(HolidayRepository.findByDate).mockResolvedValue(null);
      vi.mocked(HolidayRepository.create).mockResolvedValue({ id: 'new-h1' } as never);

      const result = await holidayService.create('t1', 'p1', { name: 'New Year', holidayDate: '2027-01-01' }, 'u1');

      expect(result.id).toBe('new-h1');
      expect(HolidayRepository.create).toHaveBeenCalled();
    });
  });
});
