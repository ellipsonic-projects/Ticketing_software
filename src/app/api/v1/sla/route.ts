import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { TicketPriority } from '@prisma/client';

import { slaService } from '@/services/project/sla.service';
import { ROLES } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { SLASettingsSchema, SLATierSchema } from '@/lib/project/sla.schema';
import { getRequestContext } from '@/lib/request-context';

async function getSLAHandler(req: NextRequest) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const policy = await slaService.getPolicy(identity.tenantId);
  return NextResponse.json({ policy });
}

// PATCH /api/v1/sla
// Body: { type: 'TIER', priority: 'LOW', responseTimeMinutes: ..., resolutionTimeMinutes: ... }
// Body: { type: 'SETTINGS', businessHoursEnabled: true }
async function updateSLAHandler(req: NextRequest) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can configure SLA');
  }

  const body = await req.json();

  if (body.type === 'TIER') {
    const parseResult = SLATierSchema.safeParse(body);
    if (!parseResult.success) {
      throw new ValidationError(
        parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        'Invalid SLA tier data',
      );
    }
    const policy = await slaService.updateTier(
      identity.tenantId,
      body.priority as TicketPriority,
      parseResult.data,
      identity.id,
    );
    return NextResponse.json({ policy });
  } else if (body.type === 'SETTINGS') {
    const parseResult = SLASettingsSchema.safeParse(body);
    if (!parseResult.success) {
      throw new ValidationError(
        parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        'Invalid SLA settings data',
      );
    }
    const policy = await slaService.updateSettings(
      identity.tenantId,
      parseResult.data,
      identity.id,
    );
    return NextResponse.json({ policy });
  } else {
    throw new ValidationError(
      [{ field: 'type', message: 'Must be TIER or SETTINGS' }],
      'Invalid update type',
    );
  }
}

export const GET = withErrorHandler(authenticate(getSLAHandler));
export const PATCH = withErrorHandler(authenticate(updateSLAHandler));
