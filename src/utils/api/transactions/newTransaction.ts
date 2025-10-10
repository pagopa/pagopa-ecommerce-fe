import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";

import {
  getSessionItem,
  SessionItems,
} from "../../../utils/storage/sessionStorage";
import { ecommerceIOClientWithPollingV1 } from "../client";
import { NewTransactionResponse } from "../../../../generated/definitions/payment-ecommerce-webview-v1/NewTransactionResponse";
import { RptId } from "../../../../generated/definitions/payment-ecommerce-webview-v1/RptId";
import { AmountEuroCents } from "../../../../generated/definitions/payment-ecommerce-webview-v1/AmountEuroCents";

export const ecommerceIOPostTransaction = (
  token: string
): Promise<O.Option<NewTransactionResponse>> =>
  pipe(
    TE.tryCatch(
      () => {
        const rptId = getSessionItem(SessionItems.rptId);
        const amount = getSessionItem(SessionItems.amount);
        return ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview(
          {
            eCommerceSessionToken: token,
            body: {
              paymentNotices: [
                {
                  rptId: rptId as RptId,
                  amount: amount as unknown as AmountEuroCents,
                },
              ],
            },
          }
        );
      },
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
