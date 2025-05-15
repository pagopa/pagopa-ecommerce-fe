import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";

import {
  ecommerceCHECKOUTClientClientWithPolling,
  ecommerceIOClientWithPollingV1,
} from "../client";
import { TransactionOutcomeInfo } from "../../../../generated/definitions/payment-ecommerce-webview-v1/TransactionOutcomeInfo";

export const ecommerceIOGetTransactionOutcomeInfo = (
  transactionId: string,
  token: string
): Promise<O.Option<TransactionOutcomeInfo>> =>
  pipe(
    TE.tryCatch(
      () =>
        ecommerceIOClientWithPollingV1.getTransactionOutcomes({
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

export const ecommerceCHECKOUTGetTransactionOutcomeInfo = (
  transactionId: string,
  token: string
): Promise<O.Option<TransactionOutcomeInfo>> =>
  pipe(
    TE.tryCatch(
      () =>
        ecommerceCHECKOUTClientClientWithPolling.getTransactionOutcomes({
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
