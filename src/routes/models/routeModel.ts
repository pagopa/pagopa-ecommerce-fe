import { getConfigOrThrow } from "../../utils/config/config";

export enum EcommerceRoutes {
  ROOT = "ecommerce-fe",
  GDI_CHECK = "gdi-check",
  ESITO = "esito",
  PAYMENT_WIDOUTH_ONBOARDING = "payment-widouth-onboarding",
}

export enum CheckoutRoutes {
  ROOT = "",
  DONA = "dona",
  AUTH_CALLBACK = "auth-callback",
  AUTH_EXPIRED = "autenticazione-scaduta",
  LEGGI_CODICE_QR = "leggi-codice-qr",
  INSERISCI_DATI_AVVISO = "inserisci-dati-avviso",
  DATI_PAGAMENTO = "dati-pagamento",
  INSERISCI_EMAIL = "inserisci-email",
  INSERISCI_CARTA = "inserisci-carta",
  SCEGLI_METODO = "scegli-metodo",
  LISTA_PSP = "lista-psp",
  RIEPILOGO_PAGAMENTO = "riepilogo-pagamento",
  GDI_CHECK = "gdi-check",
  CARRELLO = "c",
  ESITO = "esito",
  ANNULLATO = "annullato",
  SESSIONE_SCADUTA = "sessione-scaduta",
  ERRORE = "errore",
  MAINTENANCE = "maintenance",
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

const {
  ECOMMERCE_IO_CLIENT_REDIRECT_OUTCOME_PATH,
  ECOMMERCE_CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH,
} = getConfigOrThrow();

export const IO_CLIENT_REDIRECT_PATH =
  ECOMMERCE_IO_CLIENT_REDIRECT_OUTCOME_PATH;

export const CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH =
  ECOMMERCE_CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH;
