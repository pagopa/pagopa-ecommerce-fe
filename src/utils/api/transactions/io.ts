import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { TransactionInfo } from "../../../../generated/definitions/payment-ecommerce-webview/TransactionInfo";
import { Client as IOClient } from "../../../../generated/definitions/payment-ecommerce-webview/client";

export const ecommerceIOTransaction = (
  transactionId: string,
  eCommerceSessionToken: string,
  IOClient: IOClient
): Promise<O.Option<TransactionInfo>> =>
  pipe(
    TE.tryCatch(
      () =>
        IOClient.getTransactionInfo({
          eCommerceSessionToken,
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
