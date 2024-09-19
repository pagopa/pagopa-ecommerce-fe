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
  ViewOutcomeEnum,
  transactionInfoStatus,
} from "../utils/api/transactions/types";
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
  const [outcomeState, setOutcomeAndRedirect] = React.useState<ViewOutcomeEnum | null>(
    null
  );

  const redirectWithError = () => {
    setOutcomeAndRedirect(ViewOutcomeEnum.GENERIC_ERROR);
  };

  const performRedirectToClient = () => {
    const outcome = outcomeState || ViewOutcomeEnum.GENERIC_ERROR;
    redirectToClient({ transactionId, outcome, clientId });
  };

  const GetTransaction = (token: string) => {
    const manageResp = O.match(redirectWithError, (transactionInfo) => {
      setOutcomeAndRedirect(
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

  // On outcome update perform redirect
  useEffect(() => {
    if (outcomeState) {
      performRedirectToClient();
    }
  }, [outcomeState]);

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
          height: "calc(100vh - 80px)",
          display: "flex",
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
              pt: 3,
              pb: 2,
              gap: 2,
            }}
          >
            <Typography variant="h5">
              {t("resultPage.justFewMoments")}
            </Typography>
            <Typography variant="body1">
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
