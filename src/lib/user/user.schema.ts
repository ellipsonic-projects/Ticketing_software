import { z } from 'zod';

const RoleEnum = z.enum(['PLATFORM_ADMIN', 'TENANT_ADMIN', 'ENGINEER', 'CLIENT']);
const UserStatusEnum = z.enum(['INVITED', 'ACTIVE', 'INACTIVE', 'SUSPENDED']);

export const CreateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  role: RoleEnum,
  clientId: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: RoleEnum.optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const UpdateUserStatusSchema = z.object({
  status: UserStatusEnum,
});

export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusSchema>;

export const ListUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: UserStatusEnum.optional(),
  role: RoleEnum.optional(),
  sort: z
    .enum(['createdAt', 'firstName', 'lastName', 'email', 'status', 'role'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListUsersQuery = z.infer<typeof ListUsersSchema>;
export type ListUsersInput = z.input<typeof ListUsersSchema>;
