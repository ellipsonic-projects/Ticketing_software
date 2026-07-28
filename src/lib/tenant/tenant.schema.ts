import { TenantStatus } from '@prisma/client';
import { z } from 'zod';

// Reusable field types for optional nullable string/email fields.
// No transforms — coercion to null happens in the service layer.
const optionalString = z.string().nullable().optional();
const optionalEmail = z
  .string()
  .email('Invalid email address')
  .nullable()
  .optional()
  .or(z.literal('').transform(() => null as null));

export const CreateTenantSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  domain: optionalString,
  contactEmail: optionalEmail,
  contactPhone: optionalString,
  timezone: z.string().optional(),
  currency: z.string().optional(),
  admin: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
  }),
});

/** Input type inferred from CreateTenantSchema — use in services and API routes. */
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;

export const UpdateTenantSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  domain: optionalString,
  contactEmail: optionalEmail,
  contactPhone: optionalString,
  timezone: z.string().optional(),
  currency: z.string().optional(),
  status: z.nativeEnum(TenantStatus).optional(),
});

/** Input type inferred from UpdateTenantSchema — use in services and API routes. */
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;

export const ListTenantSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.nativeEnum(TenantStatus).optional(),
  sort: z.enum(['createdAt', 'name', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListTenantQuery = z.infer<typeof ListTenantSchema>;
