/* eslint-disable functional/immutable-data */
Object.defineProperty(global, "window", {
  value: {
    _env_: {
      ECOMMERCE_ENV: "develop",
      ECOMMERCE_API_TIMEOUT: "10000",
      ECOMMERCE_API_HOST: "http://localhost:1234",
      ECOMMERCE_CHECKOUT_API_PATH: "/ecommerce/checkout/v1",
      ECOMMERCE_CHECKOUT_API_V2_PATH: "/ecommerce/checkout/v2",
      ECOMMERCE_IO_API_V1_PATH: "/ecommerce/webview/v1",
      ECOMMERCE_GDI_CHECK_TIMEOUT: "12000",
      ECOMMERCE_NPG_SDK_URL: "https://example.com/sdk.js",
      ECOMMERCE_IO_CLIENT_REDIRECT_OUTCOME_PATH:
        "http://localhost:1234/io-outcome",
      ECOMMERCE_CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH:
        "http://localhost:1234/checkout-outcome",
      ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES: "5",
      ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS: "100",
      ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: "2000",
      ECOMMERCE_API_RETRY_NUMBERS_NORMAL: "2",
      ECOMMERCE_API_RETRY_NUMBERS_EXPONENT: "3",
    },
  },
  writable: true,
});

import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { exponetialPollingWithPromisePredicateFetch } from "../../config/fetch";

describe("exponetialPollingWithPromisePredicateFetch backoff behavior", () => {
  beforeAll(() => {
    jest.useFakeTimers(); // legacy timers
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockResponse200 = {
    json: jest.fn().mockResolvedValue({}),
    status: 200,
  };

  const mockResponse503 = {
    json: jest.fn().mockResolvedValue({}),
    status: 503,
  };
  it("should increase delay exponentially after RETRY_NUMBERS_NORMAL attempts", async () => {
    const condition = jest.fn(async (response) => {
      // eslint-disable-next-line no-console
      console.log("condition called with status:", response.status);
      // La prima e seconda chiamata restituiscono true (retry), la terza false (stop)
      if (condition.mock.calls.length <= 2) {
        return true;
      }
      return false;
    });

    const shouldAbort = Promise.resolve(false);

    const fetchMock = jest.fn(async () => {
      const callNum = fetchMock.mock.calls.length + 1; // +1 perché .calls.length è zero-based
      // eslint-disable-next-line no-console
      console.log("fetch called attempt", callNum);
      if (callNum === 1) {
        return mockResponse503;
      }
      if (callNum === 2) {
        return mockResponse503;
      }
      if (callNum === 3) {
        return mockResponse200;
      }
      return mockResponse200;
    });

    (global as any).fetch = fetchMock;

    const fetchWithRetry = exponetialPollingWithPromisePredicateFetch(
      shouldAbort,
      3,
      10,
      1000 as Millisecond,
      condition
    );

    const promise = fetchWithRetry("https://api.example.com");

    const retryDelays = [10, 10, 10 * 3];

    // eslint-disable-next-line functional/no-let
    for (let index = 0; index < retryDelays.length; index++) {
      const delay = retryDelays[index];
      // eslint-disable-next-line no-console
      console.log(`Advancing timers by ${delay} ms, attempt ${index + 1}`);
      jest.advanceTimersByTime(delay);
      await jest.runAllTimersAsync();
      await Promise.resolve();
    }
    // eslint-disable-next-line no-console
    console.log("AWAITING promise resolution...");
    const response = await promise;
    // eslint-disable-next-line no-console
    console.log("DONE");

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 30000);
});
