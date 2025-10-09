import React from "react";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { ChevronRight, CreditCard, CreditCardOff } from "@mui/icons-material";
import PageContainer from "../components/PageContainer";
import InformationModal, {
  InformationModalRef,
} from "../components/InformationModal";
import { ecommerceIOPostTransaction } from "../utils/api/transactions/newTransaction";
import { ecommerceIOPostWallet } from "../utils/api/wallet/newWallet";
import { getFragments } from "../utils/urlUtilities";
import { SessionItems, setSessionItem } from "../utils/storage/sessionStorage";
import { getConfigOrThrow } from "../utils/config/config";
import { ROUTE_FRAGMENT } from "./models/routeModel";
export default function SaveCardPage() {
  const moreInfoModalRef = React.useRef<InformationModalRef>(null);
  const { t } = useTranslation();

  const { sessionToken, clientId, paymentMethodId, rptId, amount } =
    getFragments(
      ROUTE_FRAGMENT.SESSION_TOKEN,
      ROUTE_FRAGMENT.CLIENT_ID,
      ROUTE_FRAGMENT.PAYMENT_METHOD_ID,
      ROUTE_FRAGMENT.RPT_ID,
      ROUTE_FRAGMENT.AMOUNT
    );

  setSessionItem(SessionItems.sessionToken, sessionToken);
  setSessionItem(SessionItems.clientId, clientId);
  setSessionItem(SessionItems.paymentMethodId, paymentMethodId);
  setSessionItem(SessionItems.rptId, rptId);
  setSessionItem(SessionItems.amount, amount);

  const { ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH } =
    getConfigOrThrow();

  const redirectOutcome = (outcome: number = 1): void => {
    window.location.replace(
      `${ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH}?outcome=${outcome}`
    );
  };

  const handleSaveRedirect = async () =>
    pipe(
      await ecommerceIOPostTransaction(sessionToken),
      O.match(
        () => redirectOutcome(),
        async ({ transactionId }) => {
          const maybeRedirectUrl = await ecommerceIOPostWallet(
            sessionToken,
            transactionId
          );

          pipe(
            maybeRedirectUrl,
            O.match(
              () => redirectOutcome(),
              ({ redirectUrl }) => {
                const url =
                  redirectUrl ??
                  `${ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH}?outcome=1`;
                window.location.replace(url);
              }
            )
          );
        }
      )
    );

  const handleNoSaveRedirect = function () {
    // #TODO
  };

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        display: "flex",
        p: 4,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PageContainer
        title={t("saveCardPage.title")}
        description={t("saveCardPage.description")}
      >
        <Button
          data-testid="moreInfo"
          variant="text"
          onClick={() => moreInfoModalRef.current?.openDialog()}
          sx={{ p: 0 }}
        >
          {t("saveCardPage.moreInfo")}
        </Button>
        <Button
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "auto",
            width: "100%",
            my: 2,
            p: 1,
          }}
          onClick={() => handleSaveRedirect()}
        >
          <CreditCard color="action" sx={{ fontSize: 28, mr: 2 }} />
          <Box sx={{ flex: 1, textAlign: "left" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {t("saveCardPage.saveTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("saveCardPage.saveDescription")}
            </Typography>
          </Box>
          <ChevronRight color="action" />
        </Button>

        <Divider />

        <Button
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "auto",
            width: "100%",
            my: 2,
            p: 1,
          }}
          onClick={() => handleNoSaveRedirect()}
        >
          <CreditCardOff color="action" sx={{ fontSize: 28, mr: 2 }} />
          <Box sx={{ flex: 1, textAlign: "left" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {t("saveCardPage.noSaveTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("saveCardPage.noSaveDescription")}
            </Typography>
          </Box>
          <ChevronRight color="action" />
        </Button>

        <InformationModal ref={moreInfoModalRef} maxWidth="sm" hideIcon>
          <Typography data-testid="modalTitle" variant="h6" sx={{ pb: 2 }}>
            {t("saveCardPage.moreInfo")}
          </Typography>

          <Box sx={{ mt: -1 }}>
            <Typography variant="body1">
              <Trans i18nKey="saveCardPage.modalBodyText">
                Default text <br /> Fallback
              </Trans>
            </Typography>

            <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                data-testid="closeButton"
                variant="contained"
                onClick={() => moreInfoModalRef.current?.closeDialog()}
              >
                {t("saveCardPage.buttonClose")}
              </Button>
            </Box>
          </Box>
        </InformationModal>
      </PageContainer>
    </Box>
  );
}
