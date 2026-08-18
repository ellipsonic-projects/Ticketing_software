import { PrismaClient } from '@prisma/client';

import '@/lib/events/registry';

const prismaClientSingleton = () => {
  // Supabase's transaction pooler can intermittently reject long-lived local
  // development connections. Use the direct endpoint locally while preserving
  // DATABASE_URL for production/serverless runtime connections.
  const directUrl = process.env.NODE_ENV === 'development' ? process.env.DIRECT_URL : undefined;

  return directUrl
    ? new PrismaClient({ datasources: { db: { url: directUrl } } })
    : new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Named export for consumers that prefer `import { prisma } from '@/lib/prisma'`
export { prisma };
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
