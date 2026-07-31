import { Ticket } from '@prisma/client';

export interface TicketWithDetails extends Ticket {
  project: {
    id: string;
    name: string;
    code: string | null;
  };
  client: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  reportedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
  sla: {
    resolutionBreachAt: Date | null;
  } | null;
  _count: {
    comments: number;
    attachments: number;
  };
}
