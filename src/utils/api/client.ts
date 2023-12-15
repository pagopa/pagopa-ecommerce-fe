import { DeferredPromise } from "@pagopa/ts-commons//lib/promises";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { createClient as createIOClient } from "../../../generated/definitions/payment-ecommerce-webview/client";
import { getConfigOrThrow } from "../config/config";
import { constantPollingWithPromisePredicateFetch } from "../config/fetch";
import { TransactionInfo } from "../../../generated/definitions/payment-ecommerce-webview/TransactionInfo";
import { EcommerceFinalStatusCodeEnumType } from "./transactions/TransactionResultUtil";

const config = getConfigOrThrow();

const pollingConfig = {
  retries: 20,
  delay: 3000,
  timeout: config.CHECKOUT_API_TIMEOUT as Millisecond,
};

const decodeFinalStatusResult = async (r: Response): Promise<boolean> => {
  const myJson = (await r.clone().json()) as TransactionInfo;
  return (
    r.status === 200 &&
    !pipe(EcommerceFinalStatusCodeEnumType.decode(myJson.status), E.isRight)
  );
};

export const ecommerceIOClientWithPolling = createIOClient({
  baseUrl: config.CHECKOUT_ECOMMERCE_HOST,
  fetchApi: constantPollingWithPromisePredicateFetch(
    DeferredPromise<boolean>().e1,
    pollingConfig.retries,
    pollingConfig.delay,
    pollingConfig.timeout,
    decodeFinalStatusResult
  ),
  basePath: config.CHECKOUT_TRANSACTION_IO_BASEPATH,
});
