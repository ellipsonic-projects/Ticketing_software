import { beforeEach, describe, expect, it, vi } from 'vitest';

import { projectService } from '@/services/project/project.service';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { clientRepository } from '@/repositories/client/client.repository';
import { AppError } from '@/lib/errors/app-error';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';

// Mock dependencies
vi.mock('@/repositories/project/project.repository');
vi.mock('@/repositories/client/client.repository');
vi.mock('@/services/audit/audit.service');
vi.mock('@/services/base/transaction', () => ({
  runInTransaction: async (cb: (db: unknown) => Promise<unknown>) => cb({}),
}));

describe('ProjectService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createProject (Uniqueness & Rules)', () => {
    it('should reject if project name exists for the SAME client', async () => {
      vi.mocked(clientRepository.findById).mockResolvedValue({ id: 'c1', tenantId: 't1', status: 'ACTIVE', deletedAt: null } as unknown as never);
      vi.mocked(ProjectRepository.existsByName).mockResolvedValue(true); // Exists!

      await expect(
        projectService.createProject('t1', { name: 'Portal', clientId: 'c1' }, 'u1')
      ).rejects.toThrow(ConflictError);

      expect(ProjectRepository.existsByName).toHaveBeenCalledWith('t1', 'c1', 'Portal');
    });

    it('should allow if project name exists for a DIFFERENT client', async () => {
      vi.mocked(clientRepository.findById).mockResolvedValue({ id: 'c2', tenantId: 't1', status: 'ACTIVE', deletedAt: null } as unknown as never);
      vi.mocked(ProjectRepository.existsByName).mockResolvedValue(false); // Does not exist for this client
      vi.mocked(ProjectRepository.create).mockResolvedValue({ id: 'p1', name: 'Portal' } as unknown as never);

      const result = await projectService.createProject('t1', { name: 'Portal', clientId: 'c2' }, 'u1');
      
      expect(result.id).toBe('p1');
      expect(ProjectRepository.create).toHaveBeenCalled();
    });

    it('should allow if project name exists in a DIFFERENT tenant', async () => {
      // Different tenant, same idea: existsByName should scope to tenant ID and return false
      vi.mocked(clientRepository.findById).mockResolvedValue({ id: 'c1', tenantId: 't2', status: 'ACTIVE', deletedAt: null } as unknown as never);
      vi.mocked(ProjectRepository.existsByName).mockResolvedValue(false); // Isolated by tenant
      vi.mocked(ProjectRepository.create).mockResolvedValue({ id: 'p2', name: 'Portal' } as unknown as never);

      const result = await projectService.createProject('t2', { name: 'Portal', clientId: 'c1' }, 'u1');
      
      expect(result.id).toBe('p2');
    });

    it('should reject if client is archived', async () => {
      vi.mocked(clientRepository.findById).mockResolvedValue({ id: 'c1', tenantId: 't1', status: 'ACTIVE', deletedAt: new Date() } as unknown as never);

      await expect(
        projectService.createProject('t1', { name: 'Portal', clientId: 'c1' }, 'u1')
      ).rejects.toThrow(AppError);
    });

    it('should reject if tenant mismatch', async () => {
      vi.mocked(clientRepository.findById).mockResolvedValue({ id: 'c1', tenantId: 't2', status: 'ACTIVE', deletedAt: null } as unknown as never);

      await expect(
        projectService.createProject('t1', { name: 'Portal', clientId: 'c1' }, 'u1')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProject', () => {
    it('should reject if project is archived', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', archivedAt: new Date() } as unknown as never);

      await expect(
        projectService.updateProject('t1', 'p1', { name: 'New Name' }, 'u1')
      ).rejects.toThrow(AppError);
    });

    it('should reject client change', async () => {
      vi.mocked(ProjectRepository.findById).mockResolvedValue({ id: 'p1', tenantId: 't1', clientId: 'c1', archivedAt: null } as unknown as never);

      await expect(
        projectService.updateProject('t1', 'p1', { clientId: 'c2' }, 'u1')
      ).rejects.toThrow(AppError);
    });
  });
});
