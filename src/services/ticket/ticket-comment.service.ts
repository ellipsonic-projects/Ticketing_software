import { ticketCommentRepository } from '@/repositories/ticket/ticket-comment.repository';
import { CreateCommentInput } from '@/lib/ticket/ticket.schema';
import { AuditService } from '@/services/audit/audit.service';
import prisma from '@/lib/prisma';
import { TicketService } from './ticket.service';
import { eventDispatcher } from '@/lib/events/dispatcher';
import { TicketCommentAddedEvent } from '@/lib/events/types';

export class TicketCommentService {
  /**
   * Adds a comment to a ticket
   */
  static async addComment(ticketId: string, tenantId: string, authorId: string, data: CreateCommentInput) {
    // Validate ticket exists and tenant access
    const ticket = await TicketService.getTicketById(ticketId, tenantId);

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await ticketCommentRepository.create({
        ticketId: ticket.id,
        authorId,
        body: data.body,
        isInternal: data.isInternal,
      }, tx);

      await AuditService.log({
        entity: 'Ticket',
        entityId: ticket.id,
        action: data.isInternal ? 'TICKET_INTERNAL_NOTE_ADDED' : 'TICKET_COMMENT_ADDED',
        actorId: authorId,
        after: { commentId: newComment.id },
      }, tx);

      return newComment;
    });

    eventDispatcher.publish(new TicketCommentAddedEvent(
      comment.id,
      ticket.id,
      ticket.number,
      tenantId,
      authorId,
      data.isInternal || false,
      data.body.substring(0, 100)
    ));

    return comment;
  }

  /**
   * Retrieves comments for a ticket
   */
  static async getComments(ticketId: string, tenantId: string, userRole: string) {
    // Validate ticket access
    await TicketService.getTicketById(ticketId, tenantId);

    const comments = await ticketCommentRepository.findByTicketId(ticketId);

    // If client, filter out internal notes
    if (userRole === 'CLIENT') {
      return comments.filter(c => !c.isInternal);
    }

    return comments;
  }
}
