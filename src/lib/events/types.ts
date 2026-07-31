import { TicketPriority, TicketStatus } from '@prisma/client';

export abstract class DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly eventName: string) {
    this.occurredOn = new Date();
  }
}

export class TicketCreatedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly title: string,
    public readonly tenantId: string,
    public readonly projectId: string,
    public readonly clientId: string,
    public readonly createdById: string,
    public readonly priority: TicketPriority
  ) {
    super('TicketCreatedEvent');
  }
}

export class TicketAssignedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly assignedToId: string,
    public readonly assignedById: string
  ) {
    super('TicketAssignedEvent');
  }
}

export class TicketReassignedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly previousAssignedToId: string | null,
    public readonly newAssignedToId: string,
    public readonly reassignedById: string
  ) {
    super('TicketReassignedEvent');
  }
}

export class TicketStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly oldStatus: TicketStatus,
    public readonly newStatus: TicketStatus,
    public readonly changedById: string
  ) {
    super('TicketStatusChangedEvent');
  }
}

export class TicketPriorityChangedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly oldPriority: TicketPriority,
    public readonly newPriority: TicketPriority,
    public readonly changedById: string
  ) {
    super('TicketPriorityChangedEvent');
  }
}

export class TicketCommentAddedEvent extends DomainEvent {
  constructor(
    public readonly commentId: string,
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly authorId: string,
    public readonly isInternal: boolean,
    public readonly bodyExcerpt: string
  ) {
    super('TicketCommentAddedEvent');
  }
}

export class TicketAttachmentAddedEvent extends DomainEvent {
  constructor(
    public readonly attachmentId: string,
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly uploaderId: string,
    public readonly filename: string
  ) {
    super('TicketAttachmentAddedEvent');
  }
}

export class TicketResolvedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly resolvedById: string
  ) {
    super('TicketResolvedEvent');
  }
}

export class TicketClosedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly closedById: string
  ) {
    super('TicketClosedEvent');
  }
}

export class TicketReopenedEvent extends DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly ticketNumber: number,
    public readonly tenantId: string,
    public readonly reopenedById: string
  ) {
    super('TicketReopenedEvent');
  }
}
