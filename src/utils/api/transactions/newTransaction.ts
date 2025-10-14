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
import { FaultCategoryEnum } from "../../../../generated/definitions/payment-ecommerce-v1/FaultCategory";
import { NodeFaultCode } from "./nodeFaultCode";

export const ecommerceIOPostTransaction = (
  token: string
): TE.TaskEither<NodeFaultCode, NewTransactionResponse> =>
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
      () =>
        TE.left({
          faultCodeCategory: FaultCategoryEnum.GENERIC_ERROR as string,
        })
    ),
    TE.fold(
      () =>
        TE.left({
          faultCodeCategory: FaultCategoryEnum.GENERIC_ERROR as string,
        }),
      (r) =>
        pipe(
          r,
          E.fold(
            () =>
              TE.left({
                faultCodeCategory: FaultCategoryEnum.GENERIC_ERROR as string,
              }),
            (response) => {
              // 200 OK
              if (response.status === 200) {
                return TE.right(response.value);
              }
              if (response.status === 400) {
                return TE.left({
                  faultCodeCategory: FaultCategoryEnum.GENERIC_ERROR as string,
                });
              }
              if (response.status === 401) {
                return TE.left({
                  faultCodeCategory: "SESSION_EXPIRED",
                  faultCodeDetail: "Unauthorized",
                });
              }
              // other error cases
              return TE.left({
                faultCodeCategory:
                  response.value?.faultCodeCategory ??
                  FaultCategoryEnum.GENERIC_ERROR as string,
                faultCodeDetail:
                  response.value?.faultCodeDetail ?? "Unknown error",
              });
            }
          )
        )
    )
  );
