import { NewTransactionResponse } from "../../../generated/definitions/payment-ecommerce-v1/NewTransactionResponse";

export enum SessionItems {
  sessionToken = "sessionToken",
}

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
