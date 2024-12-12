import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React, { useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { t } from "i18next";
import {
  ecommerceIOGetTransactionInfo,
  ecommerceCHECKOUTGetTransaction,
} from "../utils/api/transactions/getTransactionInfo";
import {
  transactionInfoStatus,
  ViewOutcomeEnum,
} from "../utils/api/transactions/types";
import PageContainer from "../components/PageContainer";
import { getOnboardingPaymentOutcome } from "../utils/api/transactions/TransactionResultUtil";
import { SessionItems, getSessionItem } from "../utils/storage/sessionStorage";
import { getFragments, redirectToClient } from "../utils/urlUtilities";
import { getConfigOrThrow } from "../utils/config/config";
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
    // performRedirectToClient(ViewOutcomeEnum.GENERIC_ERROR);
  };

  const performRedirectToClient = (newOutcome?: ViewOutcomeEnum) => {
    // if not present new outcome use old one
    const outcome = newOutcome || outcomeState || ViewOutcomeEnum.GENERIC_ERROR;
    redirectToClient({ transactionId, outcome, clientId });
    // if is new outcome, update state after timeout
    if (newOutcome) {
      setTimeout(
        () => setOutcomeState(outcome),
        config.ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS
      );
    }
  };

  const GetTransaction = (token: string) => {
    const manageResp = O.match(redirectWithError, (transactionInfo) => {
      performRedirectToClient(
        getOnboardingPaymentOutcome(transactionInfo as transactionInfoStatus)
      );
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
          await ecommerceCHECKOUTGetTransaction(transactionId, token),
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
      return GetTransaction(token);
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
              onClick={() => performRedirectToClient()}
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
