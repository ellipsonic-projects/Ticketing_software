import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Future implementations will add these as required
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  STORAGE_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  MAIL_PROVIDER: z.enum(['console', 'smtp', 'resend']).default('console'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1); // Fail fast
}

export const env = _env.data;
