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

  const manageResp = O.match(
    () =>
      redirectToClient({
        transactionId,
        outcome: ViewOutcomeEnum.GENERIC_ERROR,
        clientId,
      }),
    (transactionInfo) => {
      const outcome = getOnboardingPaymentOutcome(
        transactionInfo as transactionInfoStatus
      );
      redirectToClient({ transactionId, outcome, clientId });
    }
  );
  const IOGetTransaction = async (sessionToken: string) => {
    const token = sessionToken;
    pipe(await ecommerceIOGetTransactionInfo(transactionId, token), manageResp);
  };

  const CHECKOUTGetTransaction = async (sessionToken: string) => {
    const token = sessionToken;
    pipe(
      await ecommerceCHECKOUGetTransaction(transactionId, token),
      manageResp
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
      if (clientId === CLIENT_TYPE.IO) {
        void IOGetTransaction(validSessionToken);
      } else {
        void CHECKOUTGetTransaction(validSessionToken);
      }
    } else {
      void redirectToClient({
        outcome: ViewOutcomeEnum.GENERIC_ERROR,
        clientId,
      });
    }
  }, [clientId, transactionId, fragmentSessionToken]);

  return (
    <PageContainer>
      <CheckoutLoader />
    </PageContainer>
  );
}
