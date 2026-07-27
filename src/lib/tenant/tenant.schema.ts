import { TenantStatus } from '@prisma/client';
import { z } from 'zod';

export const CreateTenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  domain: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional()
    .nullable(),
  contactEmail: z.string().email('Invalid email address').optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
});

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;

export const UpdateTenantSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  domain: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  status: z.nativeEnum(TenantStatus).optional(),
});

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
