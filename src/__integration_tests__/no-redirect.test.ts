import "expect-puppeteer";

describe("Test showing final button for continue to IO", () => {

  const ECOMMERCE_FE_ESITO_PAGE = "http://localhost:1234/ecommerce-fe/esito#clientId=IO&sessionToken=test&transactionId=302054585254587560";

  /**
   * Default test timeout (80000ms)
    */
  jest.setTimeout(80000);
  jest.retryTimes(3);
  page.setDefaultNavigationTimeout(80000);
  page.setDefaultTimeout(80000);

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
  })


  it(`Test IO button on success payment flow`, async() => {
    console.log("Start outcome page with IO app redirect")
    await page.goto(ECOMMERCE_FE_ESITO_PAGE);
    await page.waitForSelector('#continueToIOBtn');
  })
});