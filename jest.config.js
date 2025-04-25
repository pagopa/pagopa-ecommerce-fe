module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testMatch: [
    "**/__tests__/**/*.{ts,tsx}"
  ],
  testPathIgnorePatterns: [
    "/dist/",
    "/node_modules/"
  ],
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: './test_reports',
      outputName: 'ecommerce-unit-TEST.xml',
    } ]
  ],
  globals: {
    jestSonar: {
      sonar56x: true,
      reportPath: "test_reports",
      reportFile: "sonar-report.xml",
      indent: 4
    }
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!<rootDir>/src/index.tsx",
    "!<rootDir>/src/__tests__/**/*",
    "!<rootDir>/src/__integration_tests__/**/*",
    "!<rootDir>/src/__mocks__/**/*"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "test-config",
    "\\.module\\.ts$",
    "<rootDir>/src/translations/",
    "<rootDir>/src/generated/",
    "global\\.d\\.ts$",
    "<rootDir>/src/models/",
    "<rootDir>/src/routes/models/",
    "<rootDir>/src/hooks/",
    "<rootDir>/src/utils/config/fetch.ts",
    "<rootDir>/src/utils/App.tsx"
  ],
  coverageDirectory: "<rootDir>/coverage/",
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  },
  testResultsProcessor: "jest-sonar-reporter"
};