import { DeferredPromise } from "@pagopa/ts-commons//lib/promises";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { createCounter } from "../../utils/counter";
import { createClient as createIOClientV1 } from "../../../generated/definitions/payment-ecommerce-webview-v1/client";
import { createClient as createCHECKOUTClient } from "../../../generated/definitions/payment-ecommerce-v1/client";
import { createClient as createCHECKOUTClientV2 } from "../../../generated/definitions/payment-ecommerce-v2/client";
import { getConfigOrThrow } from "../config/config";
import {
  constantPollingWithPromisePredicateFetch,
  exponetialPollingWithPromisePredicateFetch,
} from "../config/fetch";
import { TransactionOutcomeInfo } from "../../../generated/definitions/payment-ecommerce-webview-v1/TransactionOutcomeInfo";

const config = getConfigOrThrow();

export const pollingConfig = {
  retries: config.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES,
  delay: config.ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS,
  timeout: config.ECOMMERCE_API_TIMEOUT as Millisecond,
  counter: createCounter(),
};

/** This function return true when polling on GET transaction must be interrupted */

export const decodeFinalStatusResult = async (
  r: Response
): Promise<boolean> => {
  if (pollingConfig.counter.getValue() === pollingConfig.retries - 1) {
    return false;
  }
  pollingConfig.counter.increment();
  const { isFinalStatus } = (await r.clone().json()) as TransactionOutcomeInfo;
  return !(r.status === 200 && isFinalStatus);
};

export const isResponse2xxOK = async (r: Response): Promise<boolean> => {
  if (pollingConfig.counter.getValue() === pollingConfig.retries - 1) {
    return false;
  }
  pollingConfig.counter.increment();
  return !(r.status >= 200 && r.status <= 299);
};

export const ecommerceIOClientWithPollingV1WithFinalStatusDecoder =
  createIOClientV1({
    baseUrl: config.ECOMMERCE_API_HOST,
    fetchApi: exponetialPollingWithPromisePredicateFetch(
      DeferredPromise<boolean>().e1,
      pollingConfig.retries,
      pollingConfig.delay,
      pollingConfig.timeout,
      decodeFinalStatusResult
    ),
    basePath: config.ECOMMERCE_IO_API_V1_PATH,
  });

export const ecommerceIOClientWithPollingV1 = createIOClientV1({
  baseUrl: config.ECOMMERCE_API_HOST,
  fetchApi: exponetialPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    pollingConfig.retries,
    pollingConfig.delay,
    pollingConfig.timeout,
    isResponse2xxOK
  ),
  basePath: config.ECOMMERCE_IO_API_V1_PATH,
});

export const ecommerceCHECKOUTClientClientWithPolling = createCHECKOUTClient({
  baseUrl: config.ECOMMERCE_API_HOST,
  fetchApi: exponetialPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    pollingConfig.retries,
    pollingConfig.delay,
    pollingConfig.timeout,
    decodeFinalStatusResult
  ),
  basePath: config.ECOMMERCE_CHECKOUT_API_PATH,
});

export const ecommerceCHECKOUTClientClientWithPollingV2 =
  createCHECKOUTClientV2({
    baseUrl: config.ECOMMERCE_API_HOST,
    fetchApi: constantPollingWithPromisePredicateFetch(
      DeferredPromise<boolean>().e1,
      pollingConfig.retries,
      pollingConfig.delay,
      pollingConfig.timeout,
      decodeFinalStatusResult
    ),
    basePath: config.ECOMMERCE_CHECKOUT_API_V2_PATH,
  });
