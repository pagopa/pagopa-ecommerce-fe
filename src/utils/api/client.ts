import { DeferredPromise } from "@pagopa/ts-commons//lib/promises";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { createCounter } from "../../utils/counter";
import { createClient as createIOClient } from "../../../generated/definitions/payment-ecommerce-webview/client";
import { getConfigOrThrow } from "../config/config";
import { constantPollingWithPromisePredicateFetch } from "../config/fetch";
import { TransactionInfo } from "../../../generated/definitions/payment-ecommerce-webview/TransactionInfo";
import { NpgResultCodeEnum } from "./transactions/types";
import {
  EcommerceInterruptStatusCodeEnumType,
  EcommerceMaybeInterruptStatusCodeEnumType,
} from "./transactions/TransactionResultUtil";

const config = getConfigOrThrow();

const pollingConfig = {
  retries: 20,
  delay: 3000,
  timeout: config.ECOMMERCE_API_TIMEOUT as Millisecond,
  counter: createCounter(),
};

/** This function return true when polling on GET transaction must be interrupted */
const interruptTransactionPolling = (
  transactionStaus: TransactionInfo["status"],
  gatewayStaus: TransactionInfo["gatewayAuthorizationStatus"]
) =>
  pipe(
    EcommerceInterruptStatusCodeEnumType.decode(transactionStaus),
    E.isRight
  ) ||
  (pipe(
    EcommerceMaybeInterruptStatusCodeEnumType.decode(transactionStaus),
    E.isRight
  ) &&
    gatewayStaus !== NpgResultCodeEnum.EXECUTED);

const decodeFinalStatusResult = async (r: Response): Promise<boolean> => {
  pollingConfig.counter.increment();
  if (pollingConfig.counter.getValue() === pollingConfig.retries) {
    pollingConfig.counter.reset();
    return false;
  }
  const { status, gatewayAuthorizationStatus } = (await r
    .clone()
    .json()) as TransactionInfo;
  return !(
    r.status === 200 &&
    interruptTransactionPolling(status, gatewayAuthorizationStatus)
  );
};

export const ecommerceIOClientWithPolling = createIOClient({
  baseUrl: config.ECOMMERCE_API_BASE_HOST,
  fetchApi: constantPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    pollingConfig.retries,
    pollingConfig.delay,
    pollingConfig.timeout,
    decodeFinalStatusResult
  ),
  basePath: config.ECOMMERCE_API_BASE_PATH,
});
