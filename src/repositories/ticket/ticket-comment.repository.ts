import { Prisma, TicketComment } from '@prisma/client';

import prisma from '@/lib/prisma';

export class TicketCommentRepository {
  async create(
    data: Prisma.TicketCommentUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<TicketComment> {
    const client = tx || prisma;
    return client.ticketComment.create({
      data,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
  }

  async findByTicketId(ticketId: string): Promise<TicketComment[]> {
    return prisma.ticketComment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
  }
}

export const ticketCommentRepository = new TicketCommentRepository();
