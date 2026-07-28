import { Prisma, Tenant, TenantStatus } from '@prisma/client';

import prisma from '@/lib/prisma';

export class TenantRepository {
  async create(data: Prisma.TenantCreateInput, tx?: Prisma.TransactionClient): Promise<Tenant> {
    const db = tx || prisma;
    return db.tenant.create({ data });
  }

  async update(
    id: string,
    data: Prisma.TenantUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Tenant> {
    const db = tx || prisma;
    return db.tenant.update({
      where: { id },
      data,
    });
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<Tenant | null> {
    const db = tx || prisma;
    return db.tenant.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<Tenant | null> {
    const db = tx || prisma;
    return db.tenant.findUnique({
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

  async softDelete(id: string, deletedBy?: string, tx?: Prisma.TransactionClient): Promise<Tenant> {
    const db = tx || prisma;
    return db.tenant.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: deletedBy,
      },
    });
  }

  async updateStatus(
    id: string,
    status: TenantStatus,
    updatedBy?: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Tenant> {
    const db = tx || prisma;
    return db.tenant.update({
      where: { id },
      data: {
        status,
        updatedBy,
      },
    });
  }
}

export const tenantRepository = new TenantRepository();
