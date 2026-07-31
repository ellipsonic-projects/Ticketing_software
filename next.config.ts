import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverExternalPackages: ['argon2'],
    },
};

export default nextConfig;
