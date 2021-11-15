const baseConfig = require('./jest.base.conf');

const reportDefault = process.env.JEST_REPORT === 'default';

const config = {
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
};

if (!reportDefault) {
  config.coverageReporters = ['html', 'text-summary'];
}

module.exports = config;
