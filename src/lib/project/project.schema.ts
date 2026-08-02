import { z } from 'zod';

const optionalString = z.string().trim().min(1).nullable().optional().or(z.literal(''));

export const CreateProjectSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  name: z.string().trim().min(1, 'Project name is required'),
  code: optionalString,
  description: optionalString,
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  supportStatus: z.enum(['ENABLED', 'PAUSED']).optional(),
  defaultPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  supportEmail: optionalString,
  supportPhone: optionalString,
  supportNotes: optionalString,
  supportStartDate: z.string().datetime().nullable().optional().or(z.literal('')),
  supportEndDate: z.string().datetime().nullable().optional().or(z.literal('')),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export const ProjectQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  clientId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  supportStatus: z.enum(['ENABLED', 'PAUSED']).optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'name', 'client']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;
