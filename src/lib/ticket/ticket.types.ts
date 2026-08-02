import { Role, Ticket, TicketSLA } from '@prisma/client';

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
    role: Role;
  } | null;
  reportedBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
  category: {
    id: string;
    name: string;
  } | null;
  sla: TicketSLA | null;
  _count: {
    comments: number;
    attachments: number;
  };
}
