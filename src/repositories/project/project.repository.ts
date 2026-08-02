import { Prisma, PrismaClient, Project } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export class ProjectRepository {
  /**
   * Create a new project
   */
  static async create(
    data: Prisma.ProjectUncheckedCreateInput,
    db: Prisma.TransactionClient = prisma,
  ): Promise<Project> {
    return db.project.create({
      data,
    });
  }

  /**
   * Find a project by ID with tenant isolation
   */
  static async findById(
    tenantId: string,
    id: string,
    withStats: boolean = false,
  ): Promise<any | null> {
    const include: any = {
      client: true,
      businessHours: true,
      holidays: true,
    };

    if (withStats) {
      include._count = {
        select: { tickets: true },
      };
    }

    return prisma.project.findFirst({
      where: {
        id,
        tenantId,
      },
      include,
    });
  }

  /**
   * Find project by name for a client
   */
  static async findByName(
    tenantId: string,
    clientId: string,
    name: string,
  ): Promise<Project | null> {
    return prisma.project.findUnique({
      where: {
        tenantId_clientId_name: {
          tenantId,
          clientId,
          name,
        },
      },
    });
  }

  /**
   * Check if project exists by name
   */
  static async existsByName(
    tenantId: string,
    clientId: string,
    name: string,
    db: Prisma.TransactionClient = prisma,
  ): Promise<boolean> {
    const count = await db.project.count({
      where: {
        tenantId,
        clientId,
        name,
      },
    });
    return count > 0;
  }

  /**
   * Get paginated projects with optional filters
   */
  static async findMany(params: {
    tenantId: string;
    query: {
      clientId?: string;
      page: number;
      limit: number;
      search?: string;
      status?: string;
    };
  }): Promise<{ projects: any[]; total: number }> {
    const { tenantId, query } = params;
    const { clientId, page, limit, search, status } = query;

    const where: Prisma.ProjectWhereInput = {
      tenantId,
      archivedAt: null,
    };

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      where.status = status as any;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true, code: true } },
          _count: { select: { tickets: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  /**
   * Update a project
   */
  static async update(
    tenantId: string,
    id: string,
    data: Prisma.ProjectUpdateInput,
    db: Prisma.TransactionClient = prisma,
  ): Promise<Project> {
    // Note: Use findFirst to ensure tenant isolation, then update by id
    const project = await db.project.findFirst({ where: { id, tenantId } });
    if (!project) throw new Error('Project not found');

    return db.project.update({
      where: { id },
      data,
    });
  }

  /**
   * Archive a project
   */
  static async archive(tenantId: string, id: string, actorId: string): Promise<Project> {
    const project = await prisma.project.findFirst({ where: { id, tenantId } });
    if (!project) throw new Error('Project not found');

    return prisma.project.update({
      where: { id },
      data: {
        archivedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }

  /**
   * Get basic stats for a tenant's projects
   */
  static async getStats(tenantId: string): Promise<{ total: number; active: number }> {
    const [total, active] = await Promise.all([
      prisma.project.count({ where: { tenantId, archivedAt: null } }),
      prisma.project.count({ where: { tenantId, status: 'ACTIVE', archivedAt: null } }),
    ]);

    return { total, active };
  }
}
