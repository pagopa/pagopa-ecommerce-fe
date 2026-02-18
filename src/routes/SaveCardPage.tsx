import React from "react";
import { useNavigate } from "react-router-dom";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { ChevronRight, CreditCard, CreditCardOff } from "@mui/icons-material";
import { flushSync } from "react-dom";
import PageContainer from "../components/PageContainer";
import InformationModal, {
  InformationModalRef,
} from "../components/InformationModal";
import { ecommerceIOPostTransaction } from "../utils/api/transactions/newTransaction";
import { ecommerceIOPostWallet } from "../utils/api/wallet/newWallet";
import {
  getFragments,
  WalletContextualOnboardOutcomeParams,
} from "../utils/urlUtilities";
import {
  getSessionItem,
  SessionItems,
  setSessionItem,
} from "../utils/storage/sessionStorage";
import { getConfigOrThrow } from "../utils/config/config";
import { EcommerceRoutes, ROUTE_FRAGMENT } from "./models/routeModel";

export default function SaveCardPage() {
  const [isRedirectionButtonsEnabled, setIsRedirectionButtonsEnabled] =
    React.useState(true);
  const moreInfoModalRef = React.useRef<InformationModalRef>(null);
  const clickInProgressRef = React.useRef(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
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
  }, []);

  const { ECOMMERCE_IO_SAVE_CARD_FAIL_REDIRECT_PATH } = getConfigOrThrow();

  const redirectOutcomeKO = (
    walletContextualOnboardOutcomeParameters: WalletContextualOnboardOutcomeParams
  ): void => {
    const queryParams = new URLSearchParams();
    Object.entries(walletContextualOnboardOutcomeParameters).forEach(
      (paramEntry) => queryParams.append(paramEntry[0], paramEntry[1])
    );
    const url = `${ECOMMERCE_IO_SAVE_CARD_FAIL_REDIRECT_PATH}?${queryParams.toString()}`;
    window.location.replace(`${url}`);
  };

  const handleSaveRedirect = async () => {
    setIsRedirectionButtonsEnabled(false);
    await pipe(
      getSessionItem(SessionItems.sessionToken),
      E.fromNullable({ outcome: "1" } as WalletContextualOnboardOutcomeParams),
      TE.fromEither,

      TE.chainW((token) =>
        pipe(
          ecommerceIOPostTransaction(token),
          TE.map((res) => ({ ...res, token })),
          TE.mapLeft(
            (error): WalletContextualOnboardOutcomeParams => ({
              outcome: "1",
              faultCodeCategory: error.faultCodeCategory,
              faultCodeDetail: error.faultCodeDetail,
            })
          )
        )
      ),

      TE.match(
        (error: WalletContextualOnboardOutcomeParams) =>
          redirectOutcomeKO(error),
        async ({ transactionId, authToken, token }) => {
          if (authToken == null) {
            redirectOutcomeKO({
              outcome: "1",
              transactionId,
            });
          } else {
            const postWalletResponse = await ecommerceIOPostWallet(
              token,
              transactionId,
              authToken
            );
            pipe(
              postWalletResponse,
              O.match(
                // error creating wallet -> outcome KO to app io
                () =>
                  redirectOutcomeKO({
                    outcome: "1",
                    transactionId,
                  }),
                ({ walletId, redirectUrl }) => {
                  if (redirectUrl) {
                    window.location.replace(redirectUrl);
                  } else {
                    // wallet created but no redirect url returned by b.e., return error to app IO
                    redirectOutcomeKO({
                      outcome: "1",
                      walletId,
                      transactionId,
                    });
                  }
                }
              )
            );
          }
        }
      )
    )();
  };

  const handleNoSaveRedirect = function () {
    if (clickInProgressRef.current) {
      return;
    }
    // eslint-disable-next-line functional/immutable-data
    clickInProgressRef.current = true;
    flushSync(() => {
      setIsRedirectionButtonsEnabled(false);
    });
    const redirectPath = `/${EcommerceRoutes.NOT_ONBOARDED_CARD_PAYMENT}`;
    navigate(redirectPath);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        display: "flex",
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingTop: 0,
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
          data-testid="saveRedirectBtn"
          disabled={!isRedirectionButtonsEnabled}
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
          data-testid="noSaveRedirectBtn"
          disabled={!isRedirectionButtonsEnabled}
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
