import { z } from 'zod';

const optionalString = z.string().trim().min(1).nullable().optional().or(z.literal(''));
const optionalEmail = z
  .string()
  .trim()
  .email('Invalid email format')
  .nullable()
  .optional()
  .or(z.literal(''));

export const CreateClientSchema = z.object({
  name: z.string().trim().min(1, 'Client name is required'),
  code: optionalString,
  email: optionalEmail,
  phone: optionalString,
  website: optionalString,
  contactName: optionalString,
  address: optionalString,
  industry: optionalString,
  notes: optionalString,
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

export const ClientQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ClientQuery = z.infer<typeof ClientQuerySchema>;

export const OnboardClientSchema = CreateClientSchema.extend({
  email: z.string().trim().email('Invalid email format').min(1, 'Email is required for onboarding'),
  phone: z.string().trim().min(1, 'Phone number is required for onboarding'),
  contactName: z.string().trim().min(1, 'Contact name is required for onboarding'),
  project: z.object({
    name: z.string().trim().min(1, 'Project name is required'),
    code: optionalString,
    description: z.string().trim().min(1, 'Project description is required'),
  }),
});

export type OnboardClientInput = z.infer<typeof OnboardClientSchema>;
