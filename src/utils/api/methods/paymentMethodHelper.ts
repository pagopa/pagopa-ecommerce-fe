import * as E from "fp-ts/Either";
import { flow, pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { CreateSessionResponse } from "../../../../generated/definitions/payment-ecommerce-webview-v1/CreateSessionResponse";
import { ecommerceIOClientWithPollingV1 } from "../client";
import { SessionItems } from "../../storage/sessionStorage";

export const npgSessionsFields = async (): Promise<
  O.Option<CreateSessionResponse>
> =>
  pipe(
    TE.tryCatch(
      () => {
        const sessionToken =
          sessionStorage.getItem(SessionItems.sessionToken) || "";
        const clientId = sessionStorage.getItem(SessionItems.clientId) || "";
        const paymentMethodId =
          sessionStorage.getItem(SessionItems.paymentMethodId) || "";
        return ecommerceIOClientWithPollingV1.createSessionWebview({
          eCommerceSessionToken: sessionToken,
          "x-client-id": clientId,
          id: paymentMethodId,
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
