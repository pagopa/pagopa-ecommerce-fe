import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React, { useEffect } from "react";
import { ViewOutcomeEnum } from "../utils/api/transactions/types";
import CheckoutLoader from "../components/CheckoutLoader";
import PageContainer from "../components/PageContainer";
import { ecommerceIOClientWithPolling } from "../utils/api/client";
import { getOnboardingPaymentOutcome } from "../utils/api/transactions/TransactionResultUtil";
import { ecommerceIOTransaction } from "../utils/api/transactions/io";
import { SessionItems, getSessionItem } from "../utils/storage/sessionStorage";
import { getFragments, redirectToClient } from "../utils/urlUtilities";
import { CLIENT_TYPE, ROUTE_FRAGMENT } from "./models/routeModel";

export default function PaymentResponsePage() {
  const {
    clientId,
    transactionId,
    sessionToken: fragmentSessionToken,
  } = getFragments(
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
            clientId,
          }),
        (transactionInfo) => {
          const outcome = getOnboardingPaymentOutcome(transactionInfo);
          redirectToClient({ transactionId, outcome, clientId });
        }
      )
    );
  };

  useEffect(() => {
    const sessionStorageToken = getSessionItem(SessionItems.sessionToken) as
      | string
      | undefined;

    const validSessionToken = sessionStorageToken ?? fragmentSessionToken;
    if (
      validSessionToken &&
      (clientId === CLIENT_TYPE.IO || CLIENT_TYPE.CHECKOUT) &&
      transactionId
    ) {
      void appClientPolling(validSessionToken);
    } else {
      redirectToClient({ outcome: ViewOutcomeEnum.GENERIC_ERROR, clientId });
    }
  }, [clientId, transactionId, fragmentSessionToken]);

  return (
    <PageContainer>
      <CheckoutLoader />
    </PageContainer>
  );
}
