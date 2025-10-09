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
  exponetialPollingWithPromisePredicateFetch: jest.fn(
    (_abort, _retries, _delay, _timeout, _predicate) => "fetchApiMock"
  ),
  constantPollingWithPromisePredicateFetch: jest.fn(
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
  ecommerceCHECKOUTClientClientWithPolling,
  ecommerceCHECKOUTClientClientWithPollingV2,
  ecommerceIOClientWithPollingV1,
  ecommerceIOClientWithPollingV1WithFinalStatusDecoder,
} from "../client";
import {
  constantPollingWithPromisePredicateFetch,
  exponetialPollingWithPromisePredicateFetch,
} from "../../config/fetch";
import { getConfigOrThrow } from "../../config/config";
import * as IOClientPkg from "../../../../generated/definitions/payment-ecommerce-webview-v1/client";
import * as CheckoutV1Pkg from "../../../../generated/definitions/payment-ecommerce-v1/client";
import * as CheckoutV2Pkg from "../../../../generated/definitions/payment-ecommerce-v2/client";

describe("clientWithPolling module", () => {
  const config = getConfigOrThrow();

  it("create both client IOs at import time (order: finalStatus then 200OK)", () => {
    expect(IOClientPkg.createClient).toHaveBeenCalledTimes(2);

    const [ioFinalCall, io200Call] = (IOClientPkg.createClient as jest.Mock)
      .mock.calls;
    const ioFinalArgs = ioFinalCall[0];
    const io200Args = io200Call[0];

    // 1 withFinalStatusDecoder
    expect(ioFinalArgs.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(ioFinalArgs.basePath).toBe(config.ECOMMERCE_IO_API_V1_PATH);
    expect(ioFinalArgs.fetchApi).toBe("fetchApiMock");
    expect(ecommerceIOClientWithPollingV1WithFinalStatusDecoder).toBe(
      ioClientMock
    );

    // 2 isResponse200OK
    expect(io200Args.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(io200Args.basePath).toBe(config.ECOMMERCE_IO_API_V1_PATH);
    expect(io200Args.fetchApi).toBe("fetchApiMock");
    expect(ecommerceIOClientWithPollingV1).toBe(ioClientMock);
  });

  it("create CHECKOUT v1 client with polling", () => {
    expect(CheckoutV1Pkg.createClient).toHaveBeenCalledTimes(1);
    const args = (CheckoutV1Pkg.createClient as jest.Mock).mock.calls[0][0];
    expect(args.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(args.basePath).toBe(config.ECOMMERCE_CHECKOUT_API_PATH);
    expect(args.fetchApi).toBe("fetchApiMock");
    expect(ecommerceCHECKOUTClientClientWithPolling).toBe(checkoutClientMock);
  });

  it("create CHECKOUT v2 client with polling (constant)", () => {
    expect(CheckoutV2Pkg.createClient).toHaveBeenCalledTimes(1);
    const args = (CheckoutV2Pkg.createClient as jest.Mock).mock.calls[0][0];
    expect(args.baseUrl).toBe(config.ECOMMERCE_API_HOST);
    expect(args.basePath).toBe(config.ECOMMERCE_CHECKOUT_API_V2_PATH);
    expect(args.fetchApi).toBe("fetchApiMock");
    expect(ecommerceCHECKOUTClientClientWithPollingV2).toBe(
      checkoutV2ClientMock
    );
  });

  it("check the global counts of fetch wrappers", () => {
    expect(exponetialPollingWithPromisePredicateFetch).toHaveBeenCalledTimes(4);

    expect(constantPollingWithPromisePredicateFetch).toHaveBeenCalledTimes(1);

    const expoArgsSample = (
      exponetialPollingWithPromisePredicateFetch as jest.Mock
    ).mock.calls[0];
    expect(expoArgsSample[0]).toEqual(DeferredPromise<boolean>().e1);
    expect(expoArgsSample[1]).toBe(
      config.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES
    );
    expect(expoArgsSample[2]).toBe(
      config.ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS
    );
    expect(expoArgsSample[3]).toBe(config.ECOMMERCE_API_TIMEOUT);
    expect(typeof expoArgsSample[4]).toBe("function");

    const constantArgs = (constantPollingWithPromisePredicateFetch as jest.Mock)
      .mock.calls[0];
    expect(constantArgs[1]).toBe(
      config.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES
    );
    expect(constantArgs[2]).toBe(
      config.ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS
    );
    expect(constantArgs[3]).toBe(config.ECOMMERCE_API_TIMEOUT);
    expect(typeof constantArgs[4]).toBe("function");
  });
});
