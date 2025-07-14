/* eslint-disable 
    @typescript-eslint/no-var-requires,
    @typescript-eslint/dot-notation,
    no-underscore-dangle,
    functional/immutable-data
*/

describe("config module", () => {
  const validEnv = {
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
  };

  beforeEach(() => {
    jest.resetModules();
    (window as any)._env_ = { ...validEnv };
  });

  it("getConfig() should decode a valid environment", () => {
    const { getConfig } = require("../config");
    const result = getConfig();
    expect(result._tag).toBe("Right");
    if (result._tag === "Right") {
      expect(result.right.ECOMMERCE_ENV).toBe(validEnv.ECOMMERCE_ENV);
      expect(result.right.ECOMMERCE_API_TIMEOUT).toBe(10000);
      expect(result.right.ECOMMERCE_GDI_CHECK_TIMEOUT).toBe(12000);
      expect(result.right.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES).toBe(5);
      expect(result.right.ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS).toBe(
        2000
      );
      expect(result.right.ECOMMERCE_API_RETRY_NUMBERS_NORMAL).toBe(2);
      expect(result.right.ECOMMERCE_API_RETRY_NUMBERS_EXPONENT).toBe(3);
    }
  });

  it("getConfig() should return Left when required vars are missing", () => {
    (window as any)._env_ = { ECOMMERCE_ENV: "" };
    const { getConfig } = require("../config");
    const result = getConfig();
    expect(result._tag).toBe("Left");
  });

  it("getConfigOrThrow() should throw on invalid config", () => {
    (window as any)._env_ = {};
    const { getConfigOrThrow } = require("../config");
    expect(() => getConfigOrThrow()).toThrowError(/Invalid configuration/);
  });

  it("getConfigOrThrow() should return IConfig on valid env", () => {
    (window as any)._env_ = { ...validEnv };
    const { getConfigOrThrow } = require("../config");
    const cfg = getConfigOrThrow();
    expect(cfg.ECOMMERCE_API_HOST).toBe(validEnv.ECOMMERCE_API_HOST);
    expect(typeof cfg.ECOMMERCE_CHECKOUT_API_PATH).toBe("string");
  });
});
