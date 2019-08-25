module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!**/node_modules/**'],
  coverageReporters: ['html', 'text'],
  moduleNameMapper: {
    '@storybook/addons': '<rootDir>/src/__tests__/__mocks__/storybook-addons.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
