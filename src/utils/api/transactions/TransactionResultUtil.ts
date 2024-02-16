import { SendPaymentResultOutcomeEnum } from "../../../../generated/definitions/payment-ecommerce-webview/NewTransactionResponse";
import { TransactionStatusEnum } from "../../../../generated/definitions/payment-ecommerce-webview/TransactionStatus";
import {
  gatewayAuthorizationStatusType,
  ViewOutcomeEnum,
  PaymentGateway,
  NpgResultCodeEnum,
  transactionInfoStatus,
} from "./types";

export const gatewayAuthorizationStatusMap = new Map<
  gatewayAuthorizationStatusType,
  ViewOutcomeEnum
>([
  ["000", ViewOutcomeEnum.SUCCESS],
  ["100", ViewOutcomeEnum.AUTH_ERROR],
  ["101", ViewOutcomeEnum.INVALID_CARD],
  ["102", ViewOutcomeEnum.AUTH_ERROR],
  ["104", ViewOutcomeEnum.INVALID_DATA],
  ["106", ViewOutcomeEnum.AUTH_ERROR],
  ["109", ViewOutcomeEnum.GENERIC_ERROR],
  ["110", ViewOutcomeEnum.INVALID_DATA],
  ["111", ViewOutcomeEnum.INVALID_CARD],
  ["115", ViewOutcomeEnum.GENERIC_ERROR],
  ["116", ViewOutcomeEnum.AUTH_ERROR],
  ["117", ViewOutcomeEnum.AUTH_ERROR],
  ["118", ViewOutcomeEnum.INVALID_DATA],
  ["119", ViewOutcomeEnum.AUTH_ERROR],
  ["120", ViewOutcomeEnum.AUTH_ERROR],
  ["121", ViewOutcomeEnum.AUTH_ERROR],
  ["122", ViewOutcomeEnum.AUTH_ERROR],
  ["123", ViewOutcomeEnum.AUTH_ERROR],
  ["124", ViewOutcomeEnum.AUTH_ERROR],
  ["125", ViewOutcomeEnum.INVALID_DATA],
  ["126", ViewOutcomeEnum.AUTH_ERROR],
  ["129", ViewOutcomeEnum.AUTH_ERROR],
  ["200", ViewOutcomeEnum.AUTH_ERROR],
  ["202", ViewOutcomeEnum.AUTH_ERROR],
  ["204", ViewOutcomeEnum.AUTH_ERROR],
  ["208", ViewOutcomeEnum.INVALID_DATA],
  ["209", ViewOutcomeEnum.INVALID_DATA],
  ["210", ViewOutcomeEnum.INVALID_DATA],
  ["413", ViewOutcomeEnum.AUTH_ERROR],
  ["888", ViewOutcomeEnum.AUTH_ERROR],
  ["902", ViewOutcomeEnum.AUTH_ERROR],
  ["903", ViewOutcomeEnum.AUTH_ERROR],
  ["904", ViewOutcomeEnum.GENERIC_ERROR],
  ["906", ViewOutcomeEnum.GENERIC_ERROR],
  ["907", ViewOutcomeEnum.GENERIC_ERROR],
  ["908", ViewOutcomeEnum.GENERIC_ERROR],
  ["909", ViewOutcomeEnum.GENERIC_ERROR],
  ["911", ViewOutcomeEnum.GENERIC_ERROR],
  ["913", ViewOutcomeEnum.GENERIC_ERROR],
  ["999", ViewOutcomeEnum.GENERIC_ERROR],
]);

export const getOnboardingPaymentOutcome = (
  transactionInfo: transactionInfoStatus
): ViewOutcomeEnum => {
  const {
    status,
    sendPaymentResultOutcome,
    gateway,
    gatewayAuthorizationStatus,
    errorCode,
  } = transactionInfo || {};
  switch (status) {
    case TransactionStatusEnum.NOTIFIED_OK:
      return ViewOutcomeEnum.SUCCESS;
    case TransactionStatusEnum.NOTIFICATION_REQUESTED:
    case TransactionStatusEnum.NOTIFICATION_ERROR:
      return sendPaymentResultOutcome === SendPaymentResultOutcomeEnum.OK
        ? ViewOutcomeEnum.SUCCESS
        : ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.NOTIFIED_KO:
    case TransactionStatusEnum.REFUNDED:
    case TransactionStatusEnum.REFUND_REQUESTED:
    case TransactionStatusEnum.REFUND_ERROR:
    case TransactionStatusEnum.CLOSURE_ERROR:
    case TransactionStatusEnum.EXPIRED:
    case TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED:
    case TransactionStatusEnum.CANCELED:
    case TransactionStatusEnum.CANCELLATION_EXPIRED:
    case TransactionStatusEnum.CLOSED:
      return ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.UNAUTHORIZED:
      return evaluateUnauthorizedStatus(
        gateway,
        errorCode,
        gatewayAuthorizationStatus
      );
    default:
      return ViewOutcomeEnum.GENERIC_ERROR;
  }
};

function evaluateUnauthorizedStatus(
  gateway: string | undefined,
  errorCode: string | undefined,
  gatewayAuthorizationStatus: string | undefined
): ViewOutcomeEnum {
  if (gateway !== PaymentGateway.NPG) {
    return ViewOutcomeEnum.GENERIC_ERROR;
  }
  switch (errorCode) {
    case NpgResultCodeEnum.EXECUTED:
      return ViewOutcomeEnum.SUCCESS;
    case NpgResultCodeEnum.AUTHORIZED:
    case NpgResultCodeEnum.PENDING:
    case NpgResultCodeEnum.VOIDED:
    case NpgResultCodeEnum.REFUNDED:
    case NpgResultCodeEnum.FAILED:
      return ViewOutcomeEnum.GENERIC_ERROR;
    case NpgResultCodeEnum.DENIED_BY_RISK:
    case NpgResultCodeEnum.THREEDS_VALIDATED:
    case NpgResultCodeEnum.THREEDS_FAILED:
      return ViewOutcomeEnum.AUTH_ERROR;
    case NpgResultCodeEnum.CANCELED:
      return ViewOutcomeEnum.CANCELED_BY_USER;
    case NpgResultCodeEnum.DECLINED:
      return (
        gatewayAuthorizationStatusMap.get(
          gatewayAuthorizationStatus as gatewayAuthorizationStatusType
        ) || ViewOutcomeEnum.GENERIC_ERROR
      );
    default:
      return ViewOutcomeEnum.GENERIC_ERROR;
  }
}
