/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuditService } from '@/services/audit/audit.service';
import { TenantService } from '@/services/tenant/tenant.service';
import { tenantRepository } from '@/repositories/tenant/tenant.repository';

vi.mock('@/repositories/tenant/tenant.repository');
vi.mock('@/services/audit/audit.service');

describe('TenantService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('generateUniqueSlug', () => {
    it('should generate a simple slug', async () => {
      vi.mocked(tenantRepository.findBySlug).mockResolvedValue(null);
      const slug = await TenantService.generateUniqueSlug('Acme Corp');
      expect(slug).toBe('acme-corp');
    });

    it('should handle collisions by appending a number', async () => {
      vi.mocked(tenantRepository.findBySlug)
        .mockResolvedValueOnce({ id: '1', slug: 'acme' } as unknown as any)
        .mockResolvedValueOnce(null);

      const slug = await TenantService.generateUniqueSlug('Acme');
      expect(slug).toBe('acme-2');
    });
  });

  describe('createTenant', () => {
    it('should validate domain and create tenant', async () => {
      vi.mocked(tenantRepository.findBySlug).mockResolvedValue(null);
      vi.mocked(tenantRepository.findMany).mockResolvedValue([[], 0]);
      vi.mocked(tenantRepository.create).mockResolvedValue({
        id: 't1',
        name: 'Acme',
        status: 'ACTIVE',
      } as unknown as any);

      const tenant = await TenantService.createTenant({
        name: 'Acme',
        domain: 'acme.com',
        timezone: 'UTC',
        currency: 'USD',
      });

      expect(tenantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Acme', domain: 'acme.com', slug: 'acme' }),
      );
      expect(AuditService.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'Created' }));
    });
  });

  describe('updateStatus', () => {
    it('should update status and audit log', async () => {
      vi.mocked(tenantRepository.findById).mockResolvedValue({
        id: 't1',
        status: 'ACTIVE',
      } as unknown as any);
      vi.mocked(tenantRepository.updateStatus).mockResolvedValue({
        id: 't1',
        status: 'SUSPENDED',
      } as unknown as any);

      await TenantService.updateStatus('t1', 'SUSPENDED');

      expect(tenantRepository.updateStatus).toHaveBeenCalledWith('t1', 'SUSPENDED', undefined);
      expect(AuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'Suspended' }),
      );
    });
  });
});
