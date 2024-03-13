import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React, { useEffect } from "react";
import {
  ecommerceIOGetTransactionInfo,
  ecommerceCHECKOUGetTransaction,
} from "../utils/api/transactions/getTransactionInfo";
import {
  ViewOutcomeEnum,
  transactionInfoStatus,
} from "../utils/api/transactions/types";
import CheckoutLoader from "../components/CheckoutLoader";
import PageContainer from "../components/PageContainer";
import { getOnboardingPaymentOutcome } from "../utils/api/transactions/TransactionResultUtil";
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

  const redirectWithError = () =>
    redirectToClient({
      transactionId,
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
      clientId,
    });

  const GetTransaction = (token: string) => {
    const manageResp = O.match(redirectWithError, (transactionInfo) => {
      const outcome = getOnboardingPaymentOutcome(
        transactionInfo as transactionInfoStatus
      );
      redirectToClient({ transactionId, outcome, clientId });
    });

    void (async () => {
      if (clientId === CLIENT_TYPE.IO) {
        return pipe(
          await ecommerceIOGetTransactionInfo(transactionId, token),
          manageResp
        );
      }
      if (clientId === CLIENT_TYPE.CHECKOUT) {
        return pipe(
          await ecommerceCHECKOUGetTransaction(transactionId, token),
          manageResp
        );
      }
      redirectWithError();
    })();
  };

  useEffect(() => {
    const token =
      getSessionItem(SessionItems.sessionToken) ?? fragmentSessionToken;
    if (token && clientId && transactionId) {
      GetTransaction(token);
    }
    redirectWithError();
  }, [clientId, transactionId, fragmentSessionToken]);

  return (
    <PageContainer>
      <CheckoutLoader />
    </PageContainer>
  );
}
