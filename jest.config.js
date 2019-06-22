const { defaults } = require('jest-config');

module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!**/node_modules/**'],
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
