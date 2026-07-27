/* eslint-disable @typescript-eslint/no-explicit-any */
import { TenantStatus } from '@prisma/client';

import { tenantRepository } from '@/repositories/tenant/tenant.repository';
import { CreateTenantInput, UpdateTenantInput } from '@/lib/tenant/tenant.schema';

import { AuditService } from '../audit/audit.service';

export class TenantService {
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = this.generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await tenantRepository.findBySlug(slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  static async validateDomain(domain: string, excludeTenantId?: string): Promise<boolean> {
    const existing = await tenantRepository.findMany({ where: { domain } });
    const tenants = existing[0];
    if (tenants.length === 0) return true;
    if (excludeTenantId && tenants.length === 1 && tenants[0].id === excludeTenantId) return true;
    return false;
  }

  static async createTenant(input: CreateTenantInput, actorId?: string) {
    const slug = await this.generateUniqueSlug(input.name);

    if (input.domain) {
      const isDomainValid = await this.validateDomain(input.domain);
      if (!isDomainValid) throw new Error('Domain is already in use');
    }

    const tenant = await tenantRepository.create({
      name: input.name,
      slug,
      domain: input.domain,
      logoUrl: input.logoUrl,
      primaryColor: input.primaryColor,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      timezone: input.timezone,
      currency: input.currency,
      createdBy: actorId,
      updatedBy: actorId,
    });

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: 'Created',
      actorId,
      after: tenant,
    });

    return tenant;
  }

  static async updateTenant(id: string, input: UpdateTenantInput, actorId?: string) {
    const existing = await tenantRepository.findById(id);
    if (!existing) throw new Error('Tenant not found');

    if (input.domain && input.domain !== existing.domain) {
      const isDomainValid = await this.validateDomain(input.domain, id);
      if (!isDomainValid) throw new Error('Domain is already in use');
    }

    const tenant = await tenantRepository.update(id, {
      ...input,
      updatedBy: actorId,
    });

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: 'Updated',
      actorId,
      before: existing,
      after: tenant,
    });

    return tenant;
  }

  static async updateStatus(id: string, status: TenantStatus, actorId?: string) {
    const existing = await tenantRepository.findById(id);
    if (!existing) throw new Error('Tenant not found');

    const tenant = await tenantRepository.updateStatus(id, status, actorId);

    const actionMap = {
      ACTIVE: 'Activated',
      SUSPENDED: 'Suspended',
      INACTIVE: 'Deactivated',
    };

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: actionMap[status],
      actorId,
      before: existing,
      after: tenant,
    });

    return tenant;
  }

  static async softDeleteTenant(id: string, actorId?: string) {
    const existing = await tenantRepository.findById(id);
    if (!existing) throw new Error('Tenant not found');

    const tenant = await tenantRepository.softDelete(id, actorId);

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: 'Deleted',
      actorId,
      before: existing,
      after: tenant,
    });

    return tenant;
  }

  static async getTenants(
    page: number,
    pageSize: number,
    search?: string,
    status?: TenantStatus,
    sort?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    where.deletedAt = null;

    const [data, total] = await tenantRepository.findMany({
      skip,
      take: pageSize,
      where: where as any,
      orderBy: sort ? { [sort]: sortOrder } : { createdAt: 'desc' },
    });

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getTenantById(id: string) {
    const tenant = await tenantRepository.findById(id);
    if (!tenant || tenant.deletedAt) throw new Error('Tenant not found');
    return tenant;
  }
}
