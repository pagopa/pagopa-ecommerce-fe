import { getConfigOrThrow } from "../../utils/config/config";

export enum EcommerceRoutes {
  ROOT = "ecommerce-fe",
  GDI_CHECK = "gdi-check",
  ESITO = "esito",
  NOT_ONBOARDED_CARD_PAYMENT = "inserimento-carta",
  SCELTA_SALVATAGGIO_CARTA = "scelta-salvataggio-carta",
}

export enum ROUTE_FRAGMENT {
  GDI_IFRAME_URL = "gdiIframeUrl",
  CLIENT_ID = "clientId",
  SESSION_TOKEN = "sessionToken",
  TRANSACTION_ID = "transactionId",
  PAYMENT_METHOD_ID = "paymentMethodId",
  RPT_ID = "rptId",
  AMOUNT = "amount",
  IS_CHECKOUT_WALLET_PAYMENT = "isCheckoutWalletPayment",
}

export enum CLIENT_TYPE {
  IO = "IO",
  CHECKOUT = "CHECKOUT",
}

const {
  ECOMMERCE_IO_CLIENT_REDIRECT_OUTCOME_PATH,
  ECOMMERCE_CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH,
} = getConfigOrThrow();

export const IO_CLIENT_REDIRECT_PATH =
  ECOMMERCE_IO_CLIENT_REDIRECT_OUTCOME_PATH;

export const CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH =
  ECOMMERCE_CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH;
