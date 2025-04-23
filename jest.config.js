module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testMatch: [
      "**/__tests__/**/*.(tsx|ts)"
  ],
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: './test_reports',
      outputName: 'ecommerce-unit-TEST.xml',
    } ],
    [ 'jest-junit', {
      outputDirectory: './test_reports',
      outputName: 'sonar-report.xml',
    } ]
  ],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
      "src/**/*.ts",
      "src/**/*.tsx",
      "!<rootDir>/src/index.tsx",
      "!<rootDir>/src/__tests__/**/*",
      "!<rootDir>/src/__integration_tests__/**/*",
      "!<rootDir>/src/__mocks__/**/*"
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    ".module.ts",
    "<rootDir>/src/translations",
    "<rootDir>/src/generated/",
    "<rootDir>/src/__mocks__/*.ts",
    "index.tsx",
    "global.d.ts",
  ],
  testResultsProcessor: "jest-sonar-reporter"
};
