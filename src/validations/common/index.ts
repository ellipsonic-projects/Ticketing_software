import { NextRequest } from 'next/server';

import { z } from 'zod';

import { ValidationError } from '@/lib/errors/validation-error';
import { ApiErrorDetail } from '@/types/api';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const idSchema = z.object({
  id: z.string().cuid('Invalid ID format'),
});

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: ApiErrorDetail[] = result.error.issues.map((err: z.ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError(errors);
  }

  return result.data;
}

export async function validateBody<T>(schema: z.ZodSchema<T>, req: NextRequest): Promise<T> {
  const body = await req.json().catch(() => ({}));
  return validateSchema(schema, body);
}

export function validateQuery<T>(schema: z.ZodSchema<T>, req: NextRequest): T {
  const query: Record<string, string | string[]> = {};

  req.nextUrl.searchParams.forEach((value, key) => {
    const existing = query[key];
    if (existing !== undefined) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        query[key] = [existing, value];
      }
    } else {
      query[key] = value;
    }
  });

  return validateSchema(schema, query);
}

export function validateParams<T>(schema: z.ZodSchema<T>, params: unknown): T {
  return validateSchema(schema, params);
}
