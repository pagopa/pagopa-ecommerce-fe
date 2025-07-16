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
      ECOMMERCE_API_RETRY_NUMBERS_LINEAR: "2",
      ECOMMERCE_API_RETRY_NUMBERS_EXPONENT: "3",
    },
  },
  writable: true,
});


const generateExpectedDelays = (
  baseDelay: number,
  exponent: number,
  normalAttempts: number,
  totalAttempts: number
): Array<number> =>
  Array.from({ length: totalAttempts }, (_, i) =>
    i < normalAttempts
      ? baseDelay
      : baseDelay * Math.pow(exponent, i - normalAttempts)
  );

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
it("should increase delay exponentially after RETRY_NUMBERS_LINEAR attempts", async () => {
    const condition = jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);

    const shouldAbort = Promise.resolve(false);

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(mockResponse503)
      .mockResolvedValueOnce(mockResponse503)
      .mockResolvedValueOnce(mockResponse200);

    (global as any).fetch = fetchMock;

    const fetchWithRetry = exponetialPollingWithPromisePredicateFetch(
      shouldAbort,
      3,
      10,
      1000 as Millisecond,
      condition
    );

    const promise = fetchWithRetry("https://api.example.com");

    const expectedDelays = generateExpectedDelays(10, 3, 2, 3);
    /* eslint-disable functional/no-let */
    for (let i = 0; i < expectedDelays.length; i++) {
      jest.advanceTimersByTime(expectedDelays[i]);
      await jest.runAllTimersAsync();
      await Promise.resolve();
    }

    const response = await promise;

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(expectedDelays.length);
  });
});
