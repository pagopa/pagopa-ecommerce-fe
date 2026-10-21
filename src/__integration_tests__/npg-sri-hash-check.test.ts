import "expect-puppeteer";

describe("Check NPG SDK SRI hash handling", () => {
  jest.setTimeout(30000);
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(30000);

  const ECOMMERCE_FE_CARD_PAGE =
    "http://localhost:1234/inserimento-carta#clientId=IO&sessionToken=test&paymentMethodId=test";

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
  });

  // negative test only here: positive cases are covered by the card payment flows, which already check that the iframes are loaded
  it("Check that NPG SDK is not loaded for invalid SRI hash", async () => {
    // disable cache and start from a blank page so that all resources are loaded anew
    await page.setCacheEnabled(false);
    await page.goto("about:blank");

    // ask the backend mock to serve a tampered SRI hash for the SDK
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().includes("/npg/sdk/")) {
        void request.continue({
          headers: { ...request.headers(), Cookie: "tamperSriHash=true" },
        });
      } else if (request.url().startsWith("iowallet://")) {
        // the app redirects to the IO deep link when the SDK cannot be loaded
        void request.abort();
      } else {
        void request.continue();
      }
    });

    // the browser blocks the script on SRI mismatch and the app logs a custom error
    const consoleErrors= [""];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(ECOMMERCE_FE_CARD_PAGE, { waitUntil: "networkidle0" });

    console.log("Console errors :", consoleErrors);
    expect(
      consoleErrors.some((e) =>
        /NPG SDK failed to load or failed SRI validation; SDK not loaded/i.test(
          e
        )
      )
    ).toBe(true);

    // the SDK script has been blocked, so its global `Build` is not defined
    // (the card field iframes are rendered by the app itself, so they are always in the DOM)
    expect(await page.evaluate(() => typeof Build)).toBe("undefined");
  }, 30000);
});
