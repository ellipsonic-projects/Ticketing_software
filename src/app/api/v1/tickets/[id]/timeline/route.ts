/* eslint-disable */

// @ts-nocheck
import { NextRequest } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { ActivityTimelineService } from '@/services/activity/activity-timeline.service';
import { TicketService } from '@/services/ticket/ticket.service';
import { ApiResponder } from '@/lib/api-response';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

async function getTimelineHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  const params = await ctx!.params;

  // Verify access to the ticket first
  await TicketService.getTicketById(params.id, tenantId);

  const events = await ActivityTimelineService.getTimelineForEntity(tenantId, 'Ticket', params.id);

  // If the user is a client, we shouldn't show internal notes in the timeline
  // The action for internal notes is 'TICKET_INTERNAL_NOTE_ADDED'
  let filteredEvents = events;
  if (user.role === 'CLIENT') {
    filteredEvents = events.filter((e) => e.action !== 'TICKET_INTERNAL_NOTE_ADDED');
  }

  return ApiResponder.success({ events: filteredEvents });
}

export const GET = withErrorHandler(authenticate(getTimelineHandler));
