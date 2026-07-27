import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    env: {
      JWT_ACCESS_SECRET: 'test-access-secret-1234567890',
      JWT_REFRESH_SECRET: 'test-refresh-secret-1234567890',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Thresholds are intentionally omitted for now (Sprint 0.6)
      // to avoid maintaining artificial tests until a meaningful suite exists.
    },
  },
});
