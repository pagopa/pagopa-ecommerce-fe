import { getConfigOrThrow } from "../../utils/config/config";

export enum EcommerceRoutes {
  ROOT = "ecommerce-fe",
  GDI_CHECK = "gdi-check",
  ESITO = "esito",
}

export enum ROUTE_FRAGMENT {
  GDI_IFRAME_URL = "gdiIframeUrl",
  CLIENT_ID = "clientId",
  SESSION_TOKEN = "sessionToken",
  TRANSACTION_ID = "transactionId",
}

export enum CLIENT_TYPE {
  IO = "IO",
  CHECKOUT = "CHECKOUT",
}

const { CHECKOUT_TRANSACTION_BASEPATH, CHECKOUT_CONFIG_WEBVIEW_PM_HOST } =
  getConfigOrThrow();

export const CLIENT_REDIRECT_PATH = `${CHECKOUT_CONFIG_WEBVIEW_PM_HOST}${CHECKOUT_TRANSACTION_BASEPATH}`;
