import { enumType } from "@pagopa/ts-commons/lib/types";
import * as t from "io-ts";
import { SendPaymentResultOutcomeEnum } from "../../../../generated/definitions/payment-ecommerce-webview/NewTransactionResponse";
import { TransactionStatusEnum } from "../../../../generated/definitions/payment-ecommerce-webview/TransactionStatus";
import {
  gatewayAuthorizationStatusType,
  ViewOutcomeEnum,
  PaymentGateway,
  NpgResultCodeEnum,
  transactionInfoStatus,
  RedirectResultCodeEnum,
} from "./types";

export const gatewayAuthorizationStatusMap = new Map<
  gatewayAuthorizationStatusType,
  ViewOutcomeEnum
>([
  ["100", ViewOutcomeEnum.AUTH_ERROR],
  ["101", ViewOutcomeEnum.INVALID_CARD],
  ["102", ViewOutcomeEnum.AUTH_ERROR],
  ["104", ViewOutcomeEnum.INVALID_DATA],
  ["106", ViewOutcomeEnum.AUTH_ERROR],
  ["109", ViewOutcomeEnum.PSP_ERROR],
  ["110", ViewOutcomeEnum.INVALID_DATA],
  ["111", ViewOutcomeEnum.INVALID_CARD],
  ["115", ViewOutcomeEnum.PSP_ERROR],
  ["116", ViewOutcomeEnum.BALANCE_LIMIT],
  ["117", ViewOutcomeEnum.CVV_ERROR],
  ["118", ViewOutcomeEnum.INVALID_DATA],
  ["119", ViewOutcomeEnum.AUTH_ERROR],
  ["120", ViewOutcomeEnum.AUTH_ERROR],
  ["121", ViewOutcomeEnum.LIMIT_EXCEDEED],
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
  ["904", ViewOutcomeEnum.PSP_ERROR],
  ["906", ViewOutcomeEnum.PSP_ERROR],
  ["907", ViewOutcomeEnum.PSP_ERROR],
  ["908", ViewOutcomeEnum.PSP_ERROR],
  ["909", ViewOutcomeEnum.PSP_ERROR],
  ["911", ViewOutcomeEnum.PSP_ERROR],
  ["913", ViewOutcomeEnum.PSP_ERROR],
  ["999", ViewOutcomeEnum.PSP_ERROR],
]);

// eslint-disable-next-line complexity
export const getOnboardingPaymentOutcome = (
  transactionInfo: transactionInfoStatus
  // to be removed when also redirect gateway mapping will be set to PSP_ERROR in place of GENERIC_ERROR
  // eslint-disable-next-line sonarjs/cognitive-complexity
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
      return ViewOutcomeEnum.PSP_ERROR;
    case TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED:
      return ViewOutcomeEnum.TIMEOUT;
    case TransactionStatusEnum.CANCELED:
    case TransactionStatusEnum.CANCELLATION_EXPIRED:
      return ViewOutcomeEnum.CANCELED_BY_USER;
    case TransactionStatusEnum.CLOSURE_ERROR:
    case TransactionStatusEnum.CLOSURE_REQUESTED:
    case TransactionStatusEnum.AUTHORIZATION_COMPLETED:
    case TransactionStatusEnum.UNAUTHORIZED:
      return !wasAuthorizedByGateway(gateway, gatewayAuthorizationStatus)
        ? evaluateUnauthorizedStatus(
            gateway,
            errorCode,
            gatewayAuthorizationStatus
          )
        : gateway === PaymentGateway.NPG // This switch has to be removed when also redirect gateway mapping will be set to PSP_ERROR in place of GENERIC_ERROR
        ? ViewOutcomeEnum.PSP_ERROR
        : ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.CLOSED:
      return sendPaymentResultOutcome ===
        SendPaymentResultOutcomeEnum.NOT_RECEIVED
        ? ViewOutcomeEnum.TAKING_CHARGE
        : ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.EXPIRED: {
      if (!wasAuthorizedByGateway(gateway, gatewayAuthorizationStatus)) {
        return evaluateUnauthorizedStatus(
          gateway,
          errorCode,
          gatewayAuthorizationStatus
        );
      }
      if (
        sendPaymentResultOutcome === SendPaymentResultOutcomeEnum.OK &&
        wasAuthorizedByGateway(gateway, gatewayAuthorizationStatus)
      ) {
        return ViewOutcomeEnum.SUCCESS;
      }
      return ViewOutcomeEnum.GENERIC_ERROR;
    }
    case TransactionStatusEnum.AUTHORIZATION_REQUESTED:
      return ViewOutcomeEnum.TAKING_CHARGE;
    default:
      return ViewOutcomeEnum.BE_KO;
  }
};

export const wasAuthorizedByGateway = (
  gateway?: string,
  gatewayAuthorizationStatus?: string
): boolean => {
  switch (gateway) {
    case PaymentGateway.NPG:
      return gatewayAuthorizationStatus === NpgResultCodeEnum.EXECUTED;
    case PaymentGateway.REDIRECT:
      return gatewayAuthorizationStatus === RedirectResultCodeEnum.OK;
    default:
      return false;
  }
};

function evaluateUnauthorizedStatus(
  gateway?: string,
  errorCode?: string,
  gatewayAuthorizationStatus?: string
): ViewOutcomeEnum {
  switch (gateway) {
    case PaymentGateway.NPG:
      switch (gatewayAuthorizationStatus) {
        case NpgResultCodeEnum.AUTHORIZED:
        case NpgResultCodeEnum.PENDING:
        case NpgResultCodeEnum.VOIDED:
        case NpgResultCodeEnum.REFUNDED:
        case NpgResultCodeEnum.FAILED:
          return ViewOutcomeEnum.PSP_ERROR;
        case NpgResultCodeEnum.DENIED_BY_RISK:
        case NpgResultCodeEnum.THREEDS_VALIDATED:
        case NpgResultCodeEnum.THREEDS_FAILED:
          return ViewOutcomeEnum.AUTH_ERROR;
        case NpgResultCodeEnum.CANCELED:
          return ViewOutcomeEnum.CANCELED_BY_USER;
        case NpgResultCodeEnum.DECLINED:
          return (
            gatewayAuthorizationStatusMap.get(
              errorCode as gatewayAuthorizationStatusType
            ) || ViewOutcomeEnum.PSP_ERROR
          );
        default:
          return ViewOutcomeEnum.PSP_ERROR;
      }
    case PaymentGateway.REDIRECT:
      switch (gatewayAuthorizationStatus) {
        case RedirectResultCodeEnum.KO:
          return ViewOutcomeEnum.AUTH_ERROR;
        case RedirectResultCodeEnum.CANCELED:
          return ViewOutcomeEnum.CANCELED_BY_USER;
        case RedirectResultCodeEnum.ERROR:
          return ViewOutcomeEnum.GENERIC_ERROR;
        case RedirectResultCodeEnum.EXPIRED:
          return ViewOutcomeEnum.TIMEOUT;
        default:
          return ViewOutcomeEnum.GENERIC_ERROR;
      }
    default:
      return ViewOutcomeEnum.GENERIC_ERROR;
  }
}

//* ecommerce states which interrupts polling */
export enum EcommerceInterruptStatusCodeEnum {
  NOTIFICATION_REQUESTED,
  NOTIFICATION_ERROR,
  NOTIFIED_OK,
  NOTIFIED_KO,
  EXPIRED,
  REFUND_REQUESTED,
  REFUND_ERROR,
  REFUNDED,
  UNAUTHORIZED,
}

//* ecommerce states which maybe interrupts polling */
export enum EcommerceMaybeInterruptStatusCodeEnum {
  AUTHORIZATION_COMPLETED,
  CLOSURE_REQUESTED,
  CLOSURE_ERROR,
}

export type EcommerceInterruptStatusCodeEnumType = t.TypeOf<
  typeof EcommerceInterruptStatusCodeEnumType
>;
export const EcommerceInterruptStatusCodeEnumType =
  enumType<EcommerceInterruptStatusCodeEnum>(
    EcommerceInterruptStatusCodeEnum,
    "EcommerceInterruptStatusCodeEnumType"
  );

export type EcommerceMaybeInterruptStatusCodeEnumType = t.TypeOf<
  typeof EcommerceMaybeInterruptStatusCodeEnumType
>;
export const EcommerceMaybeInterruptStatusCodeEnumType =
  enumType<EcommerceMaybeInterruptStatusCodeEnum>(
    EcommerceMaybeInterruptStatusCodeEnum,
    "EcommerceMaybeInterruptStatusCodeEnumType"
  );
