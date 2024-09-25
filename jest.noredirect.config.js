module.exports = {
  preset: "jest-puppeteer",
  testRegex: "./no-redirect.test\\.ts$",
  reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test_reports',
        outputName: 'ecommerce-no-redirect-TEST.xml',
      } ]
    ]
  };

