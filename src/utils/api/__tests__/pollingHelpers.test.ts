jest.mock("../../config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_API_HOST: "http://localhost:1234",
    ECOMMERCE_IO_API_V1_PATH: "/io/v1",
    ECOMMERCE_CHECKOUT_API_PATH: "/co/1",
    ECOMMERCE_CHECKOUT_API_V2_PATH: "/co/2",
    ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES: 2,
    ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS: 50,
    ECOMMERCE_API_TIMEOUT: 500,
  }),
}));

jest.mock("../../config/fetch", () => ({
  exponetialPollingWithPromisePredicateFetch: jest
    .fn()
    .mockReturnValue((_fetch: any) => Promise.resolve(true)),
  constantPollingWithPromisePredicateFetch: jest
    .fn()
    .mockReturnValue((_fetch: any) => Promise.resolve(true)),
}));

jest.mock(
  "../../../../generated/definitions/payment-ecommerce-webview-v1/client",
  () => ({ createClient: jest.fn(() => ({ stub: "ioClient" })) })
);
jest.mock(
  "../../../../generated/definitions/payment-ecommerce-v1/client",
  () => ({ createClient: jest.fn(() => ({ stub: "checkoutV1Client" })) })
);
jest.mock(
  "../../../../generated/definitions/payment-ecommerce-v2/client",
  () => ({ createClient: jest.fn(() => ({ stub: "checkoutV2Client" })) })
);

import { decodeFinalStatusResult, pollingConfig } from "../client";

describe("decodeFinalStatusResult", () => {
  afterEach(() => {
    pollingConfig.counter.reset();
  });
  const makeResp = (status: number, body: Record<string, unknown>): Response =>
    ({
      status,
      clone() {
        return this;
      },
      async json() {
        return body;
      },
    } as any);

  it("returns false when counter reaches retries", async () => {
    const r1 = makeResp(200, {
      isFinalStatus: false,
      outcome: 1,
    });
    await decodeFinalStatusResult(r1);
    const r2 = makeResp(200, {
      isFinalStatus: false,
      outcome: 1,
    });
    expect(await decodeFinalStatusResult(r2)).toBe(false);
  });

  it("returns true for non-200 status immediately", async () => {
    const r = makeResp(500, {});
    expect(await decodeFinalStatusResult(r)).toBe(true);
  });

  it("returns false when 200 + interrupt", async () => {
    const r = makeResp(200, {
      isFinalStatus: true,
      outcome: 0,
    });
    expect(await decodeFinalStatusResult(r)).toBe(false);
  });

  it("returns true when 200 + no interrupt", async () => {
    const r = makeResp(200, {
      isFinalStatus: false,
      outcome: 1,
    });
    expect(await decodeFinalStatusResult(r)).toBe(true);
  });
});
