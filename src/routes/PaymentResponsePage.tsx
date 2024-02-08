import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React, { useEffect } from "react";
import CheckoutLoader from "../components/CheckoutLoader";
import PageContainer from "../components/PageContainer";
import { ecommerceIOClientWithPolling } from "../utils/api/client";
import {
  ViewOutcomeEnum,
  getOnboardingPaymentOutcome,
} from "../utils/api/transactions/TransactionResultUtil";
import { ecommerceIOTransaction } from "../utils/api/transactions/io";
import { SessionItems, getSessionItem } from "../utils/storage/sessionStorage";
import { getFragments, redirectToClient } from "../utils/urlUtilities";
import { CLIENT_TYPE, ROUTE_FRAGMENT } from "./models/routeModel";

export default function PaymentResponsePage() {
  const { clientId, transactionId, sessionToken } = getFragments(
    ROUTE_FRAGMENT.SESSION_TOKEN,
    ROUTE_FRAGMENT.CLIENT_ID,
    ROUTE_FRAGMENT.TRANSACTION_ID
  );

  const appClientPolling = async (sessionToken: string) => {
    pipe(
      await ecommerceIOTransaction(
        transactionId,
        sessionToken,
        ecommerceIOClientWithPolling
      ),
      O.match(
        () =>
          redirectToClient({
            transactionId,
            outcome: ViewOutcomeEnum.GENERIC_ERROR,
          }),
        (transactionInfo) => {
          const outcome = getOnboardingPaymentOutcome(
            transactionInfo.status,
            transactionInfo.sendPaymentResultOutcome
          );
          redirectToClient({ transactionId, outcome });
        }
      )
    );
  };

  useEffect(() => {
    const sessionStorageToken = getSessionItem(SessionItems.sessionToken) as
      | string
      | undefined;

    const validSessionToken =
      sessionStorageToken !== undefined ? sessionStorageToken : sessionToken;
    if (validSessionToken && clientId === CLIENT_TYPE.IO && transactionId) {
      void appClientPolling(validSessionToken);
    } else {
      redirectToClient({ outcome: ViewOutcomeEnum.GENERIC_ERROR });
    }
  }, [clientId, transactionId, sessionToken]);

  return (
    <PageContainer>
      <CheckoutLoader />
    </PageContainer>
  );
}
