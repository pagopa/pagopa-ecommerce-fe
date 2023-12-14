import { Bundle } from "../../../generated/definitions/payment-ecommerce/Bundle";
import { NewTransactionResponse } from "../../../generated/definitions/payment-ecommerce/NewTransactionResponse";
import { SessionPaymentMethodResponse } from "../../../generated/definitions/payment-ecommerce/SessionPaymentMethodResponse";

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
  item: string | NewTransactionResponse | Bundle | SessionPaymentMethodResponse
) {
  sessionStorage.setItem(
    name,
    typeof item === "string" ? item : JSON.stringify(item)
  );
}

export const clearStorage = () => {
  sessionStorage.clear();
};
