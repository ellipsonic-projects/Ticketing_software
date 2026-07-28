import type { NextConfig } from 'next';

// Trigger restart to flush stale Prisma Client in globalThis

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
