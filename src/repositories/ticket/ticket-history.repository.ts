/* eslint-disable */
import { Prisma, TicketHistory, TicketHistoryAction } from '@prisma/client';
import prisma from '@/lib/prisma';

export type TicketHistoryWithRelations = TicketHistory & {
  ticket: { number: number; title: string };
  changedBy: { firstName: string; lastName: string } | null;
};

export class TicketHistoryRepository {
  async create(
    data: Prisma.TicketHistoryUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<TicketHistory> {
    const db = tx || prisma;
    return db.ticketHistory.create({ data });
  }

  /**
   * Returns the most recent TicketHistory events for all tickets belonging
   * to the given client, ordered newest-first.
   */
  async getTimelineForClient(
    clientId: string,
    tenantId: string,
    limit = 10,
  ): Promise<TicketHistoryWithRelations[]> {
    return prisma.ticketHistory.findMany({
      where: {
        tenantId,
        ticket: { clientId },
      },
      include: {
        ticket: { select: { number: true, title: true } },
        changedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as Promise<TicketHistoryWithRelations[]>;
  }
}

export const ticketHistoryRepository = new TicketHistoryRepository();
