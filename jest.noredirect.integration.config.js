module.exports = {
  preset: "jest-puppeteer",
  testRegex: "./no-redirect.integration.test\\.ts$",
  reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test_reports',
        outputName: 'ecommerce-no-redirect-integration-TEST.xml',
      } ]
    ]
  };

