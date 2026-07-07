import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'test'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/**', 'dist/**', 'test/**', 'prisma/**', '**/*.d.ts', 'bin/**'],
    },
  },
  resolve: {
    alias: {
      '@prisma': './generated/prisma',
    },
  },
});
