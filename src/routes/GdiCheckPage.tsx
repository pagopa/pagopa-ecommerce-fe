import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ViewOutcomeEnum } from "../utils/api/transactions/types";
import CheckoutLoader from "../components/CheckoutLoader";
import PageContainer from "../components/PageContainer";
import { useNpgSdk } from "../hooks/useNpgSdk";
import { SessionItems, setSessionItem } from "../utils/storage/sessionStorage";
import {
  getBase64Fragment,
  getFragments,
  redirectToClient,
} from "../utils/urlUtilities";
import {
  CLIENT_TYPE,
  EcommerceRoutes,
  ROUTE_FRAGMENT,
} from "./models/routeModel";

const GdiCheckPage = () => {
  const navigate = useNavigate();

  // Constants
  const gdiCheckTimeout =
    Number(process.env.CHECKOUT_GDI_CHECK_TIMEOUT) || 12000;

  // Fragment Parameters
  const { sessionToken, clientId, transactionId } = getFragments(
    ROUTE_FRAGMENT.SESSION_TOKEN,
    ROUTE_FRAGMENT.CLIENT_ID,
    ROUTE_FRAGMENT.TRANSACTION_ID
  );

  const decodedGdiIframeUrl = getBase64Fragment(
    window.location.href,
    ROUTE_FRAGMENT.GDI_IFRAME_URL
  );

  // Outcome Paths
  const outcomePath = `/${EcommerceRoutes.ROOT}/${EcommerceRoutes.ESITO}#${ROUTE_FRAGMENT.CLIENT_ID}=${clientId}&${ROUTE_FRAGMENT.TRANSACTION_ID}=${transactionId}`;
  const navigateToOutcome = () => navigate(outcomePath, { replace: true });

  // Sdk Callbacks
  const onBuildError = () => {
    redirectToClient({
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
      transactionId,
      clientId,
    });
  };

  const onPaymentRedirect = (urlredirect: string) => {
    window.location.replace(urlredirect);
  };

  // Npg sdk loading
  const { buildSdk, sdkReady } = useNpgSdk({
    onPaymentComplete: navigateToOutcome,
    onBuildError,
    onPaymentRedirect,
  });

  useEffect(() => {
    if (
      clientId === CLIENT_TYPE.IO &&
      sdkReady &&
      decodedGdiIframeUrl &&
      transactionId &&
      sessionToken
    ) {
      setSessionItem(SessionItems.sessionToken, sessionToken);
      buildSdk();
    }
  }, [clientId, sdkReady, decodedGdiIframeUrl, transactionId, sessionToken]);

  // Navigate to outcome on timeout
  useEffect(() => {
    const timeoutId = setTimeout(navigateToOutcome, gdiCheckTimeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <PageContainer>
      <CheckoutLoader />
      {decodedGdiIframeUrl && (
        <iframe src={decodedGdiIframeUrl} style={{ display: "none" }} />
      )}
    </PageContainer>
  );
};

export default GdiCheckPage;
