import { Prisma, Tenant } from '@prisma/client';

import prisma from '@/lib/prisma';

export class TenantRepository {
  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    return prisma.tenant.create({ data });
  }

  async update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { slug },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput;
  }): Promise<[Tenant[], number]> {
    return prisma.$transaction([
      prisma.tenant.findMany(params),
      prisma.tenant.count({ where: params.where }),
    ]);
  }

  async softDelete(id: string, deletedBy?: string): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: deletedBy,
      },
    });
  }

  async updateStatus(
    id: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE',
    updatedBy?: string,
  ): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data: {
        status,
        updatedBy,
      },
    });
  }
}

export const tenantRepository = new TenantRepository();
