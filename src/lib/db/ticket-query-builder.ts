import { Prisma, TicketStatus, TicketPriority } from '@prisma/client';
import { ServerAuthIdentity as Identity } from '@/lib/auth/auth-context';

export interface TicketQuerySchema {
  search?: string;
  status?: TicketStatus | 'all';
  priority?: TicketPriority | 'all';
  projectId?: string;
  clientId?: string;
  assignedToId?: string;
  reportedById?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class TicketQueryBuilder {
  static build(tenantId: string, user: Identity, query: TicketQuerySchema) {
    const where: Prisma.TicketWhereInput = { tenantId };

    // Role-based Isolation Enforcement
    if (user.role === 'CLIENT') {
      where.reportedById = user.id; // Fallback until User->Client mapping exists
    } else if (user.role === 'ENGINEER') {
      // Engineers can see all tickets in the project, but we might want them to see assigned + unassigned pool
      // For now, based on standard helpdesk norms, ENGINEERS can see all tickets for the tenant unless restricted.
      // We will allow them to view all for now (as there is no project membership restriction yet).
    }

    if (query.search) {
      const isNumber = !isNaN(Number(query.search));
      
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        ...(isNumber ? [{ number: Number(query.search) }] : []),
        { project: { name: { contains: query.search, mode: 'insensitive' } } },
        { client: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.priority && query.priority !== 'all') {
      where.priority = query.priority;
    }

    if (query.projectId) {
      where.projectId = query.projectId;
    }
    
    // Allow query to filter by client if user is not a client
    if (query.clientId && user.role !== 'CLIENT') {
      where.clientId = query.clientId;
    }

    if (query.assignedToId) {
      where.assignedToId = query.assignedToId;
    }

    if (query.reportedById) {
      where.reportedById = query.reportedById;
    }

    // Default sorting: highest priority first, then newest
    let orderBy: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[] = [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ];

    if (query.sort && query.order) {
      switch (query.sort) {
        case 'number':
        case 'createdAt':
        case 'updatedAt':
        case 'priority':
        case 'status':
          orderBy = { [query.sort]: query.order };
          break;
        case 'project':
          orderBy = { project: { name: query.order } };
          break;
        case 'client':
          orderBy = { client: { name: query.order } };
          break;
      }
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 25));
    const skip = (page - 1) * limit;

    return {
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        project: { select: { id: true, name: true, code: true } },
        client: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        category: { select: { id: true, name: true } },
        sla: { select: { resolutionBreachAt: true } },
        _count: { select: { comments: true, attachments: true } },
      }
    };
  }
}
