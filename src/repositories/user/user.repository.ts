import { Prisma, User, UserStatus } from '@prisma/client';

import { prisma } from '@/lib/db';
import { CreateUserInput, ListUsersQuery, UpdateUserInput } from '@/lib/user/user.schema';

export class UserRepository {
  async create(
    tenantId: string,
    data: CreateUserInput & { password?: string; mustChangePassword?: boolean },
    createdBy?: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const db = tx || prisma;
    return db.user.create({
      data: {
        tenantId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || '', // This should ideally be a placeholder or required, but we'll supply it from service
        role: data.role,
        mustChangePassword: data.mustChangePassword || false,
        clientId: data.clientId || null,
        createdBy,
        updatedBy: createdBy,
      },
    });
  }

  async update(
    id: string,
    tenantId: string,
    data: UpdateUserInput,
    updatedBy?: string,
  ): Promise<User> {
    return prisma.user.update({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedBy,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    // Note: Email is globally unique, so tenantId is not strictly necessary here,
    // but in tenant-specific contexts, the caller should verify the tenantId matches.
    // We return deletedAt: null to ensure we don't fetch soft-deleted users.
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findMany(
    tenantId: string,
    query: ListUsersQuery,
  ): Promise<{ data: User[]; total: number }> {
    const { page, pageSize, search, status, role, sort, sortOrder } = query;

    const where: Prisma.UserWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sort]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: UserStatus,
    updatedBy?: string,
  ): Promise<User> {
    return prisma.user.update({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      data: {
        status,
        updatedBy,
      },
    });
  }

  async softDelete(id: string, tenantId: string, updatedBy?: string): Promise<User> {
    return prisma.user.update({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedBy,
      },
    });
  }
}

export const userRepository = new UserRepository();
