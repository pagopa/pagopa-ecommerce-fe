import "expect-puppeteer";

describe("Check final status on IO mapping tests", () => {
  /**
     * Test input and configuration
  */

  const ECOMMERCE_FE_ESITO_PAGE = "http://localhost:1234/ecommerce-fe/esito#clientId=IO&sessionToken=test&transactionId=";

  /**
   * Add all mock flow. Reference to the flow defined into the checkout be mock
   */
  const mockTransactionIdsWithExpectedResultMap = new Map([
    ["302054585254587560","0"],
    ["302054585254587561","0"],
    ["302054585254587562","25"],
    /*["302054585254587563","0"],
    ["302054585254587564","25"],
    ["302054585254587565","25"],
    ["302054585254587566","25"],
    ["302054585254587567","1"],
    ["302054585254587568","1"],
    ["302054585254587569","4"],
    ["302054585254587570","8"],
    ["302054585254587571","8"],
    ["302054585254587572","1"],
    ["302054585254587573","8"],
    ["302054585254587574","25"],
    ["302054585254587575","2"],
    ["302054585254587576","17"],
    ["302054585254587577","1"],
    ["302054585254587578","0"],
    ["302054585254587579","17"]*/
  ]);


   /**
   * Default test timeout (80000ms)
    */
  jest.setTimeout(80000);
  jest.retryTimes(3);
  page.setDefaultNavigationTimeout(80000);
  page.setDefaultTimeout(80000);

  beforeAll(async () => {
    await page.goto(ECOMMERCE_FE_ESITO_PAGE);
    await page.setViewport({ width: 1200, height: 907 });
  })


  for (const [transactionId, expectedOutcome] of mockTransactionIdsWithExpectedResultMap) {
    it(`TransactionId ${transactionId} with expected outcome: ${expectedOutcome}`, async() => {
      console.log(`Executing transactionId: [${transactionId}]. expected outcome: [${expectedOutcome}]`);
      await page.goto(ECOMMERCE_FE_ESITO_PAGE + transactionId);
      await page.waitForFunction("window.location.pathname.includes('ecommerce/io-outcomes/v1/transactions')")
      const pollingOutcome = Number.parseInt(page.url().split("outcome=")[1]);
      expect(pollingOutcome).toBe(Number.parseInt(expectedOutcome));
    })
  }
});