import { DeferredPromise } from "@pagopa/ts-commons//lib/promises";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { createCounter } from "../../utils/counter";
import { createClient as createIOClient } from "../../../generated/definitions/payment-ecommerce-webview/client";
import { createClient as createCHECKOUTClient } from "../../../generated/definitions/payment-ecommerce/client";
import { getConfigOrThrow } from "../config/config";
import { constantPollingWithPromisePredicateFetch } from "../config/fetch";
import { TransactionInfo } from "../../../generated/definitions/payment-ecommerce-webview/TransactionInfo";
import {
  EcommerceInterruptStatusCodeEnumType,
  EcommerceMaybeInterruptStatusCodeEnumType,
  wasAuthorizedByGateway,
} from "./transactions/TransactionResultUtil";

const config = getConfigOrThrow();

const pollingConfig = {
  retries: config.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES,
  delay: config.ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS,
  timeout: config.ECOMMERCE_API_TIMEOUT as Millisecond,
  counter: createCounter(),
};

/** This function return true when polling on GET transaction must be interrupted */
const interruptTransactionPolling = (
  transactionStatus: TransactionInfo["status"],
  gatewayStatus: TransactionInfo["gatewayAuthorizationStatus"],
  gateway: TransactionInfo["gateway"]
) =>
  pipe(
    EcommerceInterruptStatusCodeEnumType.decode(transactionStatus),
    E.isRight
  ) ||
  (pipe(
    EcommerceMaybeInterruptStatusCodeEnumType.decode(transactionStatus),
    E.isRight
  ) &&
    !wasAuthorizedByGateway(gateway, gatewayStatus));

const decodeFinalStatusResult = async (r: Response): Promise<boolean> => {
  pollingConfig.counter.increment();
  if (pollingConfig.counter.getValue() === pollingConfig.retries) {
    pollingConfig.counter.reset();
    return false;
  }
  const { status, gatewayAuthorizationStatus, gateway } = (await r
    .clone()
    .json()) as TransactionInfo;
  return !(
    r.status === 200 &&
    interruptTransactionPolling(status, gatewayAuthorizationStatus, gateway)
  );
};

export const ecommerceIOClientWithPolling = createIOClient({
  baseUrl: config.ECOMMERCE_API_HOST,
  fetchApi: constantPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    pollingConfig.retries,
    pollingConfig.delay,
    pollingConfig.timeout,
    decodeFinalStatusResult
  ),
  basePath: config.ECOMMERCE_IO_API_PATH,
});

export const ecommerceCHECKOUTClientClientWithPolling = createCHECKOUTClient({
  baseUrl: config.ECOMMERCE_API_HOST,
  fetchApi: constantPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    pollingConfig.retries,
    pollingConfig.delay,
    pollingConfig.timeout,
    decodeFinalStatusResult
  ),
  basePath: config.ECOMMERCE_CHECKOUT_API_PATH,
});
