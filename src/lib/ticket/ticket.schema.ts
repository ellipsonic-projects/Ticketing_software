import { TicketPriority, TicketStatus } from '@prisma/client';
import { z } from 'zod';

export const CreateTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  projectId: z.string().cuid('Valid project required'),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  categoryId: z.string().cuid().optional(),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

export const UpdateTicketSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  categoryId: z.string().cuid().optional(),
});

export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;

export const AssignTicketSchema = z.object({
  assignedToId: z.string().cuid('Valid engineer ID required').nullable(),
});

export type AssignTicketInput = z.infer<typeof AssignTicketSchema>;

export const CreateCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(5000),
  isInternal: z.boolean().default(false),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
