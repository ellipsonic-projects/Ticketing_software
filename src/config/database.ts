import { env } from './env';

export const dbConfig = {
  databaseUrl: env.DATABASE_URL,
  directUrl: env.DIRECT_URL,
} as const;
