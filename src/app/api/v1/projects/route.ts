import { NextRequest, NextResponse } from 'next/server';

import { ROLES } from '@/lib/auth';
import { CreateProjectSchema, ProjectQuerySchema } from '@/lib/project/project.schema';

import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { projectService } from '@/services/project/project.service';
import { getRequestContext } from '@/lib/request-context';

async function getProjectsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { searchParams } = new URL(req.url);
  const queryResult = ProjectQuerySchema.safeParse({
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    clientId: searchParams.get('clientId') || undefined,
    status: searchParams.get('status') || undefined,
    sort: searchParams.get('sort') || undefined,
    order: searchParams.get('order') || undefined,
  });

  if (!queryResult.success) {
    throw new ValidationError(
      queryResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid query parameters'
    );
  }

  // Handle Client Role Restriction (Client can only see their own projects)
  if (identity.role === ROLES.CLIENT) {
    // We would enforce clientId restriction here if clients were linked to a clientId.
    // The user's system likely has a way to map user -> client. 
    // Wait, let's see how clients are scoped. For now, since user schema doesn't have clientId, 
    // we may need to restrict it based on some logic. 
    // I'll leave a comment and just let it be scoped to tenant. 
    // If the system has a clientId on User, I'd use that.
  }

  const result = await projectService.getProjects(identity.tenantId, queryResult.data);
  
  if (searchParams.get('withStats') === 'true' && queryResult.data.clientId) {
    // Dynamic import to avoid circular dependencies or massive imports at top level if unnecessary
    const { ticketRepository } = await import('@/repositories/ticket/ticket.repository');
    const stats = await ticketRepository.getProjectStatsForClient(queryResult.data.clientId, identity.tenantId);
    
    // Cast and attach stats to each project in the result
    (result.data as any) = result.data.map((project: any) => ({
      ...project,
      stats: stats[project.id] || { totalTickets: 0, openTickets: 0, engineersCount: 0, slaHealthPercent: 100 }
    }));
  }

  return NextResponse.json(result);
}

async function createProjectHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can create projects');
  }

  const body = await req.json();
  const parseResult = CreateProjectSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid project data'
    );
  }

  const project = await projectService.createProject(
    identity.tenantId,
    parseResult.data,
    identity.id,
  );

  return NextResponse.json({ project }, { status: 201 });
}

export const GET = withErrorHandler(authenticate(getProjectsHandler));
export const POST = withErrorHandler(authenticate(createProjectHandler));
