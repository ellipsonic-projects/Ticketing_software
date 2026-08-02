import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { projectService } from '@/services/project/project.service';
import { ROLES } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { CreateProjectSchema, ProjectQuerySchema } from '@/lib/project/project.schema';
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
      queryResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      'Invalid query parameters',
    );
  }

  // Enforce CLIENT role restriction: clients can only see projects belonging to their own company
  if (identity.role === ROLES.CLIENT) {
    if (!identity.clientId) {
      throw new ForbiddenError('Client context not found for this user');
    }
    // Force the clientId filter — override whatever was passed in the query
    queryResult.data.clientId = identity.clientId;
  }

  const result = await projectService.getProjects(identity.tenantId, queryResult.data);

  if (searchParams.get('withStats') === 'true' && queryResult.data.clientId) {
    // Dynamic import to avoid circular dependencies or massive imports at top level if unnecessary
    const { ticketRepository } = await import('@/repositories/ticket/ticket.repository');
    const stats = await ticketRepository.getProjectStatsForClient(
      queryResult.data.clientId,
      identity.tenantId,
    );

    // Cast and attach stats to each project in the result
    (result.data as any) = result.data.map((project: any) => ({
      ...project,
      stats: stats[project.id] || {
        totalTickets: 0,
        openTickets: 0,
        engineersCount: 0,
        slaHealthPercent: 100,
      },
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
      parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      'Invalid project data',
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
