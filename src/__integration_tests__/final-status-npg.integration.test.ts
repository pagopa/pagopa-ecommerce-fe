import "expect-puppeteer";

describe("Unauthorized npg final status mapping tests", () => {
  /**
     * Test input and configuration
  */

  const ECOMMERCE_FE_ESITO_PAGE = "http://localhost:1234/esito#clientId=CHECKOUT&sessionToken=test&transactionId=1234";

  /**
   * Add all mock flow. Reference to the flow defined into the checkout be mock
   */
  const mockFlowWithExpectedResultMap = new Map([
    [
      "000",
      "0"
    ],
    [
      "001",
      "1"
    ],
    [
      "002",
      "2"
    ],
    [
      "003",
      "3"
    ],
    [
      "004",
      "4"
    ],
    [
      "007",
      "7"
    ],
    [
      "008",
      "8"
    ],
    [
      "017",
      "17"
    ],
    [
      "018",
      "18"
    ],
    [
      "025",
      "25"
    ],
    [
      "099",
      "99"
    ],
    [
      "116",
      "116"
    ],
    [
      "117",
      "117"
    ],
    [
      "121",
      "121"
    ]
  ])


  /**
   * Increase default test timeout (80000ms)
   * to support entire payment flow
    */
  jest.setTimeout(60000);
  jest.retryTimes(0);

  for (const [test, expectedOutcome] of mockFlowWithExpectedResultMap) {
    it(`NPG ${test} with expected outcome: ${expectedOutcome}`, async() => {
      console.log(`Executing test: [${test}]. expected outcome: [${expectedOutcome}]`);
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(30000);
      page.setDefaultTimeout(30000);
      await page.goto(ECOMMERCE_FE_ESITO_PAGE);
      await page.setCookie({ name: "transactionOutcome", value: test });
      await page.waitForFunction("window.location.pathname.includes('v2/esito')")
      const pollingOutcome = Number.parseInt(page.url().split("outcome=")[1]);
      expect(pollingOutcome).toBe(Number.parseInt(expectedOutcome));
      page.close();
    })
  }
});