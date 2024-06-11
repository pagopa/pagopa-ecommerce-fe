import "expect-puppeteer";

describe("Cancel URL integration tests", () => {
  /**
     * Test input and configuration
  */

  const ECOMMERCE_CANCEL_PAGE = "http://localhost:1234/ecommerce-fe/cancel#clientId=[clientIdPlaceholder]&transactionId=1234";

  /**
   * Add all mock flow. Reference to the flow defined into the checkout be mock
   */
  const clientIdExpectedUrlResult = new Map([
  
    [
      "IO",
      "8"
    ],
    [
      "CHECKOUT",
      "8"
    ]
  ]);


  /**
   * Increase default test timeout (80000ms)
   * to support entire payment flow
    */
  jest.setTimeout(120000);
  jest.retryTimes(0);
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(120000);

  beforeAll(async () => {
    await page.goto(ECOMMERCE_CANCEL_PAGE);
    await page.setViewport({ width: 1200, height: 907 });
  })


  for (const [clientId, expectedOutcome] of clientIdExpectedUrlResult) {
    it(`${test} with expected outcome: ${expectedOutcome}`, async() => {
      console.log(`Executing test: [${test}]. expected outcome: [${expectedOutcome}]`);
      const pageUrl = ECOMMERCE_CANCEL_PAGE.replace("[clientIdPlaceholder]", clientId);
      console.log(pageUrl)
      await page.goto(pageUrl);
      await page.waitForFunction("window.location.href.includes('outcome=')")
      const pollingOutcome = Number.parseInt(page.url().split("outcome=")[1]);
      expect(pollingOutcome).toBe(Number.parseInt(expectedOutcome));
    })
  }
});