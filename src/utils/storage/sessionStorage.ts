import { NewTransactionResponse } from "../../../generated/definitions/payment-ecommerce-webview/NewTransactionResponse";

export enum SessionItems {
  sessionToken = "sessionToken",
  useremail = "useremail",
  pspSelected = "pspSelected",
  cart = "cart",
  transaction = "transaction",
}

export const isStateEmpty = (item: SessionItems) => !getSessionItem(item);

export const getSessionItem = (item: SessionItems) => {
  try {
    const serializedState = sessionStorage.getItem(item);

    if (!serializedState) {
      return undefined;
    }

    return serializedState;
  } catch (e) {
    return undefined;
  }
};

export function setSessionItem(
  name: SessionItems,
  item: string | NewTransactionResponse
) {
  sessionStorage.setItem(
    name,
    typeof item === "string" ? item : JSON.stringify(item)
  );
}

export const clearStorage = () => {
  sessionStorage.clear();
};
