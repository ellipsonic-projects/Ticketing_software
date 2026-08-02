import { Prisma } from '@prisma/client';

import { ClientQuery } from '@/lib/client/client.schema';

export class ClientQueryBuilder {
  static buildFilters(tenantId: string, query: ClientQuery): Prisma.ClientWhereInput {
    const where: Prisma.ClientWhereInput = {
      tenantId,
    };

    if (query.status) {
      if (query.status === 'ARCHIVED') {
        where.deletedAt = { not: null };
      } else {
        where.status = query.status;
        where.deletedAt = null;
      }
    } else {
      // By default, exclude archived clients unless specifically requested
      where.deletedAt = null;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  static buildSorting(query: ClientQuery): Prisma.ClientOrderByWithRelationInput {
    // We already validated query.sort to be 'createdAt' | 'updatedAt' | 'name'
    return {
      [query.sort]: query.order,
    };
  }

  static buildPagination(query: ClientQuery): { skip: number; take: number } {
    return {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };
  }

  static build(tenantId: string, query: ClientQuery) {
    return {
      where: this.buildFilters(tenantId, query),
      orderBy: this.buildSorting(query),
      ...this.buildPagination(query),
    };
  }
}
