import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { TransactionInfo as IOTransactionInfo } from "../../../../generated/definitions/payment-ecommerce-webview/TransactionInfo";
import { TransactionInfo as CHECKOUTTransactionInfo } from "../../../../generated/definitions/payment-ecommerce/TransactionInfo";

import {
  ecommerceCHECKOUTClientClientWithPolling,
  ecommerceIOClientWithPolling,
} from "../client";

export const ecommerceIOGetTransactionInfo = (
  transactionId: string,
  token: string
): Promise<O.Option<IOTransactionInfo>> =>
  pipe(
    TE.tryCatch(
      () =>
        ecommerceIOClientWithPolling.getTransactionInfo({
          eCommerceSessionToken: token,
          transactionId,
        }),
      () => E.toError
    ),
    TE.match(
      () => O.none,
      flow(
        E.match(
          () => O.none,
          (responseType) => {
            if (responseType.status === 200) {
              return O.some(responseType.value);
            } else {
              return O.none;
            }
          }
        )
      )
    )
  )();

export const ecommerceCHECKOUGetTransaction = (
  transactionId: string,
  token: string
): Promise<O.Option<CHECKOUTTransactionInfo>> =>
  pipe(
    TE.tryCatch(
      () =>
        ecommerceCHECKOUTClientClientWithPolling.getTransactionInfo({
          bearerAuth: token,
          transactionId,
        }),
      () => E.toError
    ),
    TE.match(
      () => O.none,
      flow(
        E.match(
          () => O.none,
          // eslint-disable-next-line sonarjs/no-identical-functions
          (responseType) => {
            if (responseType.status === 200) {
              return O.some(responseType.value);
            } else {
              return O.none;
            }
          }
        )
      )
    )
  )();
