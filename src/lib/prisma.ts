import { PrismaClient } from '@prisma/client';
import '@/lib/events/registry';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Named export for consumers that prefer `import { prisma } from '@/lib/prisma'`
export { prisma };
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
