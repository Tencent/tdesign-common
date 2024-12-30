import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/**/*test.{ts,js}'],
    coverage: {
      reportsDirectory: './test/coverage',
      include: ['js/**/*.ts'],
      exclude: ['js/global-config'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
