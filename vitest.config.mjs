import { defineConfig } from 'vitest/config';

export default defineConfig({
  include: 'test/unit/**/*.test.js',
  coverage: {
    reporter: ['text', 'json', 'html'],
  },
});
