import { eventDispatcher } from '@/lib/events/dispatcher';
import {
  TicketAssignedEvent,
  TicketClosedEvent,
  TicketCommentAddedEvent,
  TicketCreatedEvent,
  TicketResolvedEvent,
  TicketStatusChangedEvent,
} from '@/lib/events/types';

export class TicketEmailHandler {
  public static register() {
    eventDispatcher.subscribe(TicketCreatedEvent, async (event) => {
      console.log(
        `[EmailHandler] Sending 'Ticket Created' email for #${event.ticketNumber} to Client ${event.clientId}`,
      );
      // TODO: Implement Resend logic in Phase 3.2
    });

    eventDispatcher.subscribe(TicketAssignedEvent, async (event) => {
      console.log(
        `[EmailHandler] Sending 'Ticket Assigned' email for #${event.ticketNumber} to Engineer ${event.assignedToId}`,
      );
    });

    eventDispatcher.subscribe(TicketCommentAddedEvent, async (event) => {
      console.log(
        `[EmailHandler] Sending 'New Comment' email for ticket #${event.ticketNumber}. Internal? ${event.isInternal}`,
      );
    });

    eventDispatcher.subscribe(TicketStatusChangedEvent, async (event) => {
      console.log(
        `[EmailHandler] Sending 'Status Changed' email for ticket #${event.ticketNumber} (${event.oldStatus} -> ${event.newStatus})`,
      );
    });

    eventDispatcher.subscribe(TicketResolvedEvent, async (event) => {
      console.log(
        `[EmailHandler] Sending 'Ticket Resolved' email for ticket #${event.ticketNumber}`,
      );
    });

    eventDispatcher.subscribe(TicketClosedEvent, async (event) => {
      console.log(`[EmailHandler] Sending 'Ticket Closed' email for ticket #${event.ticketNumber}`);
    });
  }
}
