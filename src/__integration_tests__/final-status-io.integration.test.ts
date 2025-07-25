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
    ["302054585254587000","0"],
    ["302054585254587001","1"],
    ["302054585254587002","2"],
    ["302054585254587003","3"],
    ["302054585254587004","4"],
    ["302054585254587007","7"],
    ["302054585254587008","8"],
    ["302054585254587010","10"],
    ["302054585254587017","17"],
    ["302054585254587018","18"],
    ["302054585254587025","25"],
    ["302054585254587099","99"],
    ["302054585254587116","116"],
    ["302054585254587117","117"],
    ["302054585254587121","121"],
  ]);


   /**
   * Default test timeout (80000ms)
    */
  jest.setTimeout(30000);
  jest.retryTimes(3);

  for (const [transactionId, expectedOutcome] of mockTransactionIdsWithExpectedResultMap) {
    it(`TransactionId ${transactionId} with expected outcome: ${expectedOutcome}`, async() => {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(10000);
      page.setDefaultTimeout(10000);
      console.log(`Executing transactionId: [${transactionId}]. expected outcome: [${expectedOutcome}]`);
      await page.goto(ECOMMERCE_FE_ESITO_PAGE + transactionId);
      await page.waitForFunction("window.location.pathname.includes('ecommerce/io-outcomes/v1/transactions')")
      const pollingOutcome = Number.parseInt(page.url().split("outcome=")[1]);
      expect(pollingOutcome).toBe(Number.parseInt(expectedOutcome));
    })
  }
});