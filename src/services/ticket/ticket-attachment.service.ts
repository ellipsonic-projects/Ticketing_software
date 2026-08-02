import { AuditService } from '@/services/audit/audit.service';
import { prisma } from '@/lib/prisma';

export class TicketAttachmentService {
  /**
   * Get all attachments for a ticket
   */
  static async getAttachments(ticketId: string, tenantId: string) {
    // Ensure tenant isolation
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, tenantId },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return prisma.ticketAttachment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Save attachment metadata after successful upload
   */
  static async createAttachment(
    ticketId: string,
    tenantId: string,
    uploaderId: string,
    data: { filename: string; size: number; mimeType: string; url: string },
  ) {
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, tenantId },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const attachment = await prisma.ticketAttachment.create({
      data: {
        ticketId,
        uploaderId,
        filename: data.filename,
        size: data.size,
        mimeType: data.mimeType,
        url: data.url,
      },
    });

    await AuditService.log({
      entity: 'TicketAttachment',
      entityId: attachment.id,
      action: 'TICKET_ATTACHMENT_ADDED',
      actorId: uploaderId,
      after: { filename: data.filename, ticketId },
    });

    return attachment;
  }
}
