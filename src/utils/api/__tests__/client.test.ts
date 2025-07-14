jest.mock("../../config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_API_HOST: "https://api.example.com",
    ECOMMERCE_IO_API_V1_PATH: "/io/v1",
    ECOMMERCE_CHECKOUT_API_PATH: "/checkout/v1",
    ECOMMERCE_CHECKOUT_API_V2_PATH: "/checkout/v2",
    ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES: 5,
    ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS: 200,
    ECOMMERCE_API_TIMEOUT: 3000,
  }),
}));

jest.mock("../../config/fetch", () => ({
  exponetialPollingWithPromisePredicateFetch : jest.fn(
    (_abort, _retries, _delay, _timeout, _predicate) => "fetchApiMock"
  ),
}));

const ioClientMock = {};
const checkoutClientMock = {};
const checkoutV2ClientMock = {};
jest.mock(
  "../../../../generated/definitions/payment-ecommerce-webview-v1/client",
  () => ({
    createClient: jest.fn(() => ioClientMock),
  })
);
jest.mock(
  "../../../../generated/definitions/payment-ecommerce-v1/client",
  () => ({
    createClient: jest.fn(() => checkoutClientMock),
  })
);
jest.mock(
  "../../../../generated/definitions/payment-ecommerce-v2/client",
  () => ({
    createClient: jest.fn(() => checkoutV2ClientMock),
  })
);

import { DeferredPromise } from "@pagopa/ts-commons/lib/promises";
import {
  ecommerceIOClientWithPollingV1,
  ecommerceCHECKOUTClientClientWithPolling,
  ecommerceCHECKOUTClientClientWithPollingV2,
} from "../client";
import { exponetialPollingWithPromisePredicateFetch  } from "../../config/fetch";
import { getConfigOrThrow } from "../../config/config";
import * as IOClientPkg from "../../../../generated/definitions/payment-ecommerce-webview-v1/client";
import * as CheckoutV1Pkg from "../../../../generated/definitions/payment-ecommerce-v1/client";
import * as CheckoutV2Pkg from "../../../../generated/definitions/payment-ecommerce-v2/client";

describe("clientWithPolling module", () => {
  const config = getConfigOrThrow();
  const predicate = expect.any(Function);

  it("creates IO client with polling", () => {
    expect(IOClientPkg.createClient).toHaveBeenCalledTimes(1);
    const args = (IOClientPkg.createClient as jest.Mock).mock.calls[0][0];
    expect(args.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(args.basePath).toBe(config.ECOMMERCE_IO_API_V1_PATH);
    expect(args.fetchApi).toBe("fetchApiMock");
    expect(exponetialPollingWithPromisePredicateFetch ).toHaveBeenCalledWith(
      DeferredPromise<boolean>().e1,
      config.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES,
      config.ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS,
      config.ECOMMERCE_API_TIMEOUT,
      predicate
    );
    expect(ecommerceIOClientWithPollingV1).toBe(ioClientMock);
  });

  it("creates CHECKOUT v1 client with polling", () => {
    expect(CheckoutV1Pkg.createClient).toHaveBeenCalledTimes(1);
    const args = (CheckoutV1Pkg.createClient as jest.Mock).mock.calls[0][0];
    expect(args.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(args.basePath).toBe(config.ECOMMERCE_CHECKOUT_API_PATH);
    expect(args.fetchApi).toBe("fetchApiMock");
    expect(ecommerceCHECKOUTClientClientWithPolling).toBe(checkoutClientMock);
  });

  it("creates CHECKOUT v2 client with polling", () => {
    expect(CheckoutV2Pkg.createClient).toHaveBeenCalledTimes(1);
    const args = (CheckoutV2Pkg.createClient as jest.Mock).mock.calls[0][0];
    expect(args.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(args.basePath).toBe(config.ECOMMERCE_CHECKOUT_API_V2_PATH);
    expect(args.fetchApi).toBe("fetchApiMock");
    expect(ecommerceCHECKOUTClientClientWithPollingV2).toBe(
      checkoutV2ClientMock
    );
  });
});
