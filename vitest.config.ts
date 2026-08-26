/**
 * VITEST CONFIGURATION
 * 
 * Test runner for unit, integration tests.
 * E2E tests may use Playwright later.
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['backend/**/*.ts', 'shared/**/*.ts', 'templates/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'node_modules/**'],
    },
  },
  resolve: {
    alias: {
      '@frontend': path.resolve(__dirname, 'frontend'),
      '@backend': path.resolve(__dirname, 'backend'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@templates': path.resolve(__dirname, 'templates'),
      '@components': path.resolve(__dirname, 'frontend/components'),
      '@layouts': path.resolve(__dirname, 'frontend/layouts'),
      '@db': path.resolve(__dirname, 'backend/db'),
      '@services': path.resolve(__dirname, 'backend/services'),
      '@repos': path.resolve(__dirname, 'backend/repositories'),
      '@lib': path.resolve(__dirname, 'backend/lib'),
    },
  },
});
