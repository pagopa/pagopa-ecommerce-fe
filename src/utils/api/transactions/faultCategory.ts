import { FaultCodeCategoryEnum as PaymentDuplicated } from "../../../../generated/definitions/payment-ecommerce-webview-v1/PaymentDuplicatedStatusFaultPaymentProblemJson";
import { FaultCodeCategoryEnum as PaymentOngoing } from "../../../../generated/definitions/payment-ecommerce-webview-v1/PaymentOngoingStatusFaultPaymentProblemJson";
import { FaultCodeCategoryEnum as PaymentExpired } from "../../../../generated/definitions/payment-ecommerce-webview-v1/PaymentExpiredStatusFaultPaymentProblemJson";
import { FaultCodeCategoryEnum as PaymentCanceled } from "../../../../generated/definitions/payment-ecommerce-webview-v1/PaymentCanceledStatusFaultPaymentProblemJson";
import { FaultCodeCategoryEnum as PaymentUnavailable } from "../../../../generated/definitions/payment-ecommerce-webview-v1/ValidationFaultPaymentUnavailableProblemJson";
import { FaultCodeCategoryEnum as PaymentUnknown } from "../../../../generated/definitions/payment-ecommerce-webview-v1/ValidationFaultPaymentUnknownProblemJson";
import { FaultCodeCategoryEnum as PaymentDataError } from "../../../../generated/definitions/payment-ecommerce-webview-v1/ValidationFaultPaymentDataErrorProblemJson";
import { FaultCodeCategoryEnum as DomainUnknown } from "../../../../generated/definitions/payment-ecommerce-webview-v1/PartyConfigurationFaultPaymentProblemJson";
import { FaultCodeCategoryEnum as GenericError } from "../../../../generated/definitions/payment-ecommerce-webview-v1/GatewayFaultPaymentProblemJson";

/**
 * Fault code categories of the PagoPA Verifica and Attiva operations: the union
 * of the `faultCodeCategory` enums of the error schemas returned by the
 * newTransaction operation (404, 409, 502, 503).
 */
export type FaultCategoryEnum =
  | PaymentDuplicated
  | PaymentOngoing
  | PaymentExpired
  | PaymentCanceled
  | PaymentUnavailable
  | PaymentUnknown
  | PaymentDataError
  | DomainUnknown
  | GenericError;

export type FaultCategory = `${FaultCategoryEnum}`;

export const FaultCategoryEnum = {
  ...PaymentDuplicated,
  ...PaymentOngoing,
  ...PaymentExpired,
  ...PaymentCanceled,
  ...PaymentUnavailable,
  ...PaymentUnknown,
  ...PaymentDataError,
  ...DomainUnknown,
  ...GenericError,
} as const;
