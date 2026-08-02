import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { clientService } from '@/services/client/client.service';
import { ROLES } from '@/lib/auth';
import { OnboardClientSchema } from '@/lib/client/client.schema';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { getRequestContext } from '@/lib/request-context';

async function onboardClientHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can onboard clients');
  }

  const body = await req.json();
  const parseResult = OnboardClientSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      'Invalid onboarding data',
    );
  }

  const result = await clientService.onboardClient(
    identity.tenantId,
    parseResult.data,
    identity.id,
  );

  return NextResponse.json(result, { status: 201 });
}

export const POST = withErrorHandler(authenticate(onboardClientHandler));
