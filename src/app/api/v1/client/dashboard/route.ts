import { authenticate } from '@/middleware/authenticate';
import { z } from 'zod';

import { ClientDashboardService } from '@/services/client/client-dashboard.service';
import { ApiResponder } from '@/lib/api-response';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(6),
  ticketSort: z.enum(['title', 'project', 'status', 'priority', 'updatedAt']).default('updatedAt'),
  ticketOrder: z.enum(['asc', 'desc']).default('desc'),
  ticketProjectId: z.string().min(1).optional(),
  projectPage: z.coerce.number().min(1).default(1),
  projectLimit: z.coerce.number().min(1).max(50).default(6),
});

/**
 * GET /api/v1/client/dashboard
 * Role-gated to CLIENT. Returns the full dashboard payload.
 */
export const GET = withErrorHandler(
  authenticate(async (req: Request) => {
    const identity = getRequestContext()?.identity;

    if (!identity || identity.role !== 'CLIENT' || !identity.clientId) {
      throw new ForbiddenError();
    }

    const { searchParams } = new URL(req.url);
    const { page, limit, ticketSort, ticketOrder, ticketProjectId, projectPage, projectLimit } =
      QuerySchema.parse({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        ticketSort: searchParams.get('ticketSort'),
        ticketOrder: searchParams.get('ticketOrder'),
        ticketProjectId: searchParams.get('ticketProjectId') || undefined,
        projectPage: searchParams.get('projectPage'),
        projectLimit: searchParams.get('projectLimit'),
      });

    const data = await ClientDashboardService.getDashboardData(
      identity.clientId,
      identity.tenantId!,
      identity.id,
      page,
      limit,
      ticketSort,
      ticketOrder,
      ticketProjectId,
      projectPage,
      projectLimit,
    );

    return ApiResponder.success(data, 'Dashboard data retrieved successfully');
  }),
);
