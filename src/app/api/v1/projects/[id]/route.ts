import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { projectService } from '@/services/project/project.service';
import { ROLES } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { UpdateProjectSchema } from '@/lib/project/project.schema';
import { getRequestContext } from '@/lib/request-context';

async function getProjectHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const project = await projectService.getProjectById(identity.tenantId, id, identity.id);

  return NextResponse.json({ project });
}

async function updateProjectHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can update projects');
  }

  const { id } = await ctx!.params;
  const body = await req.json();
  const parseResult = UpdateProjectSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      'Invalid project data',
    );
  }

  const project = await projectService.updateProject(
    identity.tenantId,
    id,
    parseResult.data,
    identity.id,
  );

  return NextResponse.json({ project });
}

async function archiveProjectHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can archive projects');
  }

  const { id } = await ctx!.params;
  const project = await projectService.archiveProject(identity.tenantId, id, identity.id);

  return NextResponse.json({ project });
}

export const GET = withErrorHandler(authenticate(getProjectHandler));
export const PATCH = withErrorHandler(authenticate(updateProjectHandler));
export const DELETE = withErrorHandler(authenticate(archiveProjectHandler));
