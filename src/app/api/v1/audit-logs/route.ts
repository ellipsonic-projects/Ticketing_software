import { NextRequest } from 'next/server';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { ApiResponder } from '@/lib/api-response';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

async function getAuditLogsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const entity = searchParams.get('entity');
  const action = searchParams.get('action');

  let whereClause: any = {};

  // Apply basic filters if provided
  if (entity) whereClause.entity = entity;
  if (action) whereClause.action = action;

  // RBAC Scoping Logic
  if (user.role === Role.PLATFORM_ADMIN) {
    const tenantId = searchParams.get('tenantId');
    if (tenantId) {
      whereClause.tenantId = tenantId;
    }
  } else if (user.role === Role.TENANT_ADMIN) {
    if (!user.tenantId) throw new ForbiddenError('Tenant ID is required');
    whereClause.tenantId = user.tenantId;
  } else if (user.role === Role.ENGINEER) {
    if (!user.tenantId) throw new ForbiddenError('Tenant ID is required');
    whereClause.tenantId = user.tenantId;
    
    const assignedTickets = await prisma.ticket.findMany({
      where: { tenantId: user.tenantId, assignedToId: user.id },
      select: { id: true },
    });
    const ticketIds = assignedTickets.map(t => t.id);

    whereClause.OR = [
      { actorId: user.id },
      { entity: 'Ticket', entityId: { in: ticketIds } }
    ];
  } else if (user.role === Role.CLIENT) {
    if (!user.tenantId) throw new ForbiddenError('Tenant ID is required');
    whereClause.tenantId = user.tenantId;
    if (user.clientId) {
      whereClause.clientId = user.clientId;
    } else {
      whereClause.id = 'none';
    }
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({
      where: whereClause,
    }),
  ]);

  // Fetch User metadata for actors
  const actorIds = [...new Set(logs.map(log => log.actorId).filter(Boolean))] as string[];
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true },
  });
  
  const actorMap = new Map(actors.map((a) => [a.id, a]));

  const formattedLogs = logs.map(log => {
    const actor = log.actorId ? actorMap.get(log.actorId) : null;
    return {
      ...log,
      actor: actor ? {
        name: `${actor.firstName} ${actor.lastName}`.trim(),
        avatarUrl: actor.avatarUrl,
        role: actor.role,
      } : null
    };
  });

  return ApiResponder.success({
    items: formattedLogs,
    totalItems: total,
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  });
}

export const GET = withErrorHandler(authenticate(getAuditLogsHandler));
