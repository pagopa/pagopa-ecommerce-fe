import "expect-puppeteer";

describe("Test showing final button for continue to IO", () => {

  const ECOMMERCE_FE_ESITO_PAGE = "http://localhost:1234/ecommerce-fe/esito#clientId=IO&sessionToken=test&transactionId=302054585254587560";

  /**
   * Increase default test timeout (80000ms)
   * to support entire payment flow
    */
  jest.setTimeout(120000);
  jest.retryTimes(0);
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(120000);

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
  })


  it(`Test IO button on success payment flow`, async() => {
    console.log("Start outcome page with IO app redirect")
    await page.goto(ECOMMERCE_FE_ESITO_PAGE);
    await page.waitForSelector('#continueToIOBtn');
  })
});