import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { TransactionInfo as CHECKOUTTransactionInfo } from "../../../../generated/definitions/payment-ecommerce-v2/TransactionInfo";

import {
  ecommerceCHECKOUTClientClientWithPollingV2,
  ecommerceIOClientWithPollingV2,
} from "../client";
import { TransactionOutcomeInfo } from "../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionOutcomeInfo";


  export const ecommerceIOGetTransactionOutcomeInfo = (
    transactionId: string,
    token: string
  ): Promise<O.Option<TransactionOutcomeInfo>> =>
    pipe(
      TE.tryCatch(
        () =>
          ecommerceIOClientWithPollingV2.getTransactionOutcomes({
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
): Promise<O.Option<CHECKOUTTransactionInfo>> =>
  pipe(
    TE.tryCatch(
      () =>
        ecommerceCHECKOUTClientClientWithPollingV2.getTransactionInfo({
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
