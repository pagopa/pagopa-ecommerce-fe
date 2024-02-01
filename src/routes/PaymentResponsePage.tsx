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
  const { clientId, transactionId } = getFragments(
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
          const outcome = getOnboardingPaymentOutcome(transactionInfo);
          redirectToClient({ transactionId, outcome });
        }
      )
    );
  };

  useEffect(() => {
    const sessionToken = getSessionItem(SessionItems.sessionToken) as
      | string
      | undefined;
    if (sessionToken && clientId === CLIENT_TYPE.IO && transactionId) {
      void appClientPolling(sessionToken);
    } else {
      redirectToClient({ outcome: ViewOutcomeEnum.GENERIC_ERROR });
    }
  }, [clientId, transactionId]);

  return (
    <PageContainer>
      <CheckoutLoader />
    </PageContainer>
  );
}
