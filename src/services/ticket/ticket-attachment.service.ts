import { prisma } from '@/lib/prisma';
import { AuditService } from '@/services/audit/audit.service';

export class TicketAttachmentService {
  /**
   * Get all attachments for a ticket
   */
  static async getAttachments(ticketId: string, tenantId: string) {
    // Ensure tenant isolation
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, tenantId }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return prisma.ticketAttachment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' }
    });
  }
}