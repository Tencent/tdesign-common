const baseConfig = require('./jest.base.conf');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  testRegex: 'unit/.*\\.test\\.js$',
  // close coverage by default
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'utils/**/*.{ts,tsx,js,jsx}',
    'js/**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
  ],
  coverageReporters: ['html', 'text-summary'],
};
