import { TicketHistoryAction } from '@prisma/client';

import prisma from '@/lib/prisma';

const SOURCE_TYPE = 'TICKET_HISTORY';

const ACTION_MAP: Record<TicketHistoryAction, string> = {
  CREATED: 'TICKET_CREATED',
  STATUS_CHANGED: 'TICKET_STATUS_CHANGED',
  PRIORITY_CHANGED: 'TICKET_PRIORITY_CHANGED',
  ASSIGNED: 'TICKET_ASSIGNED',
  REASSIGNED: 'TICKET_REASSIGNED',
  UNASSIGNED: 'TICKET_UNASSIGNED',
  COMMENT_ADDED: 'TICKET_COMMENT_ADDED',
  ATTACHMENT_ADDED: 'TICKET_ATTACHMENT_ADDED',
  RESOLVED: 'TICKET_RESOLVED',
  CLOSED: 'TICKET_CLOSED',
  REOPENED: 'TICKET_REOPENED',
};

async function main() {
  const history = await prisma.ticketHistory.findMany({
    include: { ticket: { select: { clientId: true } } },
    orderBy: { createdAt: 'asc' },
  });

  let created = 0;
  let linked = 0;

  for (const entry of history) {
    const action = ACTION_MAP[entry.action];
    const source = { sourceType: SOURCE_TYPE, sourceId: entry.id };

    const existingSource = await prisma.auditLog.findUnique({ where: { sourceType_sourceId: source } });
    if (existingSource) continue;

    const matchingLegacyLog = await prisma.auditLog.findFirst({
      where: {
        entity: 'Ticket',
        entityId: entry.ticketId,
        action,
        sourceType: null,
        sourceId: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (matchingLegacyLog) {
      await prisma.auditLog.update({
        where: { id: matchingLegacyLog.id },
        data: { ...source, clientId: entry.ticket.clientId },
      });
      linked++;
      continue;
    }

    await prisma.auditLog.create({
      data: {
        entity: 'Ticket',
        entityId: entry.ticketId,
        action,
        actorId: entry.changedById,
        tenantId: entry.tenantId,
        clientId: entry.ticket.clientId,
        ...source,
        before: entry.oldValue ? { value: entry.oldValue } : undefined,
        after: entry.newValue ? { value: entry.newValue } : undefined,
        createdAt: entry.createdAt,
      },
    });
    created++;
  }

  console.log(`Backfill complete: ${created} audit logs created, ${linked} legacy logs linked.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
