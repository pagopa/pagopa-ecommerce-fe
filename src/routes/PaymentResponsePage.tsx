import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React, { useEffect } from "react";
import PageContainer from "../components/PageContainer";
import CheckoutLoader from "../components/CheckoutLoader";
import { ecommerceIOClientWithPolling } from "../utils/api/client";
import {
  ViewOutcomeEnum,
  getOnboardingPaymentOutcome,
} from "../utils/api/transactions/TransactionResultUtil";
import { ecommerceIOTransaction } from "../utils/api/transactions/io";
import { getConfigOrThrow } from "../utils/config/config";
import { getFragments } from "../utils/urlUtilities";
import { SessionItems, getSessionItem } from "../utils/storage/sessionStorage";
import { CLIENT_TYPE, ROUTE_FRAGMENT } from "./models/routeModel";

export default function PaymentResponsePage() {
  const config = getConfigOrThrow();

  const redirectToClient = (transactionId: string, outcome: ViewOutcomeEnum) =>
    window.location.replace(
      `${config.CHECKOUT_CONFIG_WEBVIEW_PM_HOST}${config.CHECKOUT_TRANSACTION_BASEPATH}/${transactionId}/outcomes?outcome=${outcome}`
    );

  const { clientId, transactionId } = getFragments(
    ROUTE_FRAGMENT.CLIENT_ID,
    ROUTE_FRAGMENT.TRANSACTION_ID
  );

  const appClientPolling = async () => {
    const sessionToken = getSessionItem(SessionItems.sessionToken) as
      | string
      | undefined;
    if (sessionToken && clientId && transactionId) {
      pipe(
        await ecommerceIOTransaction(
          transactionId,
          sessionToken,
          ecommerceIOClientWithPolling
        ),
        O.match(
          () => redirectToClient(transactionId, ViewOutcomeEnum.GENERIC_ERROR),
          (transactionInfo) => {
            const outcome = getOnboardingPaymentOutcome(transactionInfo.status);
            redirectToClient(transactionId, outcome);
          }
        )
      );
    }
  };

  useEffect(() => {
    if (clientId === CLIENT_TYPE.IO) {
      void appClientPolling();
    }
  }, [clientId, transactionId]);

  return (
    <PageContainer>
      <CheckoutLoader />
    </PageContainer>
  );
}
