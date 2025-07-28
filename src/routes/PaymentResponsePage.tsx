import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React, { useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { t } from "i18next";
import { pollingConfig } from "../utils/api/client";
import {
  ecommerceIOGetTransactionOutcomeInfo,
  ecommerceCHECKOUTGetTransactionOutcomeInfo,
} from "../utils/api/transactions/getTransactionInfo";
import { ViewOutcomeEnum } from "../utils/api/transactions/types";
import PageContainer from "../components/PageContainer";
import { SessionItems, getSessionItem } from "../utils/storage/sessionStorage";
import { getFragments, redirectToClient } from "../utils/urlUtilities";
import { getConfigOrThrow } from "../utils/config/config";
import { TransactionOutcomeInfo } from "../../generated/definitions/payment-ecommerce-webview-v1/TransactionOutcomeInfo";
import { AmountEuroCents } from "../../generated/definitions/payment-ecommerce-webview-v1/AmountEuroCents";
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
  const [outcomeState, setOutcomeState] =
    React.useState<ViewOutcomeEnum | null>(null);
  const config = getConfigOrThrow();

  const redirectWithError = () => {
    performRedirectToTouchpoint(ViewOutcomeEnum.GENERIC_ERROR);
  };

  const performRedirectToTouchpoint = (
    newOutcome?: ViewOutcomeEnum,
    totalAmount?: AmountEuroCents,
    fees?: AmountEuroCents
  ) => {
    // if not present new outcome use old one
    const outcome = newOutcome || outcomeState || ViewOutcomeEnum.GENERIC_ERROR;
    redirectToClient({ transactionId, outcome, clientId, totalAmount, fees });
    // if is new outcome, update state after timeout
    if (newOutcome) {
      setTimeout(
        () => setOutcomeState(outcome),
        config.ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS
      );
    }
  };

  const getTransactionOutcome = (token: string) => {
    const manageResp = O.match(redirectWithError, (transactionInfo) => {
      const outcomeInfo = transactionInfo as TransactionOutcomeInfo;
      performRedirectToTouchpoint(
        outcomeInfo.outcome.toString() as ViewOutcomeEnum,
        outcomeInfo.totalAmount,
        outcomeInfo.fees
      );
    });

    void (async () => {
      if (clientId === CLIENT_TYPE.IO) {
        return pipe(
          await ecommerceIOGetTransactionOutcomeInfo(transactionId, token),
          manageResp
        );
      }
      if (clientId === CLIENT_TYPE.CHECKOUT) {
        return pipe(
          await ecommerceCHECKOUTGetTransactionOutcomeInfo(
            transactionId,
            token
          ),
          manageResp
        );
      }
      redirectWithError();
    })();
  };

  useEffect(() => {
    const maxRetriesReached =
      pollingConfig.counter.getValue() >= pollingConfig.retries - 1;
    const token =
      getSessionItem(SessionItems.sessionToken) ?? fragmentSessionToken;
    if (!maxRetriesReached && token && clientId && transactionId) {
      return getTransactionOutcome(token);
    }
    redirectWithError();
  }, [clientId, transactionId, fragmentSessionToken]);

  return (
    <PageContainer>
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          display: "flex",
          pb: 20,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
        {clientId === CLIENT_TYPE.IO && outcomeState && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "400px",
              textAlign: "center",
              p: 3,
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {t("resultPage.justFewMoments")}
            </Typography>
            <Typography variant="body2">
              {t("resultPage.completeOperationMsg")}
            </Typography>
            <Button
              sx={{
                mt: 2,
              }}
              variant="outlined"
              onClick={() => performRedirectToTouchpoint()}
              id="continueToIOBtn"
            >
              {t("resultPage.continueToIO")}
            </Button>
          </Box>
        )}
      </Box>
    </PageContainer>
  );
}
