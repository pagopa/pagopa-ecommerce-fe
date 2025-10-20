import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { ecommerceIOClientV1 } from "../client";

import {
  getSessionItem,
  SessionItems,
} from "../../../utils/storage/sessionStorage";
import { WalletTransactionCreateResponse } from "../../../../generated/definitions/payment-ecommerce-webview-v1/WalletTransactionCreateResponse";
import { AmountEuroCents } from "../../../../generated/definitions/payment-ecommerce-webview-v1/AmountEuroCents";

export const ecommerceIOPostWallet = (
  token: string,
  transactionId: string
): Promise<O.Option<WalletTransactionCreateResponse>> =>
  pipe(
    TE.tryCatch(
      () => {
        const paymentMethodId =
          getSessionItem(SessionItems.paymentMethodId) ?? "";
        const amount = getSessionItem(SessionItems.amount);
        return ecommerceIOClientV1.createWalletForTransactionsForIO({
          pagoPAPlatformSessionToken: token,
          transactionId,
          body: {
            useDiagnosticTracing: true,
            paymentMethodId,
            amount: amount as unknown as AmountEuroCents,
          },
        });
      },
      () => E.toError
    ),
    TE.match(
      () => O.none,
      flow(
        E.match(
          () => O.none,
          (responseType) => {
            if (responseType.status === 201) {
              return O.some(responseType.value);
            } else {
              return O.none;
            }
          }
        )
      )
    )
  )();
