import { Prisma } from '@prisma/client';

import { ProjectQuery } from '@/lib/project/project.schema';

export class ProjectQueryBuilder {
  static buildFilters(tenantId: string, query: ProjectQuery): Prisma.ProjectWhereInput {
    const where: Prisma.ProjectWhereInput = {
      tenantId,
    };

    if (query.clientId) {
      where.clientId = query.clientId;
    }

    if (query.status) {
      if (query.status === 'ARCHIVED') {
        where.archivedAt = { not: null };
      } else {
        where.status = query.status;
        where.archivedAt = null;
      }
    } else {
      where.archivedAt = null;
    }

    if (query.supportStatus) {
      where.supportStatus = query.supportStatus;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        {
          client: {
            name: { contains: query.search, mode: 'insensitive' },
          },
        },
      ];
    }

    return where;
  }

  static buildSorting(query: ProjectQuery): Prisma.ProjectOrderByWithRelationInput {
    if (query.sort === 'client') {
      return { client: { name: query.order } };
    }
    return {
      [query.sort]: query.order,
    };
  }

  static buildPagination(query: ProjectQuery): { skip: number; take: number } {
    return {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };
  }

  static build(tenantId: string, query: ProjectQuery) {
    return {
      where: this.buildFilters(tenantId, query),
      orderBy: this.buildSorting(query),
      ...this.buildPagination(query),
    };
  }
}
