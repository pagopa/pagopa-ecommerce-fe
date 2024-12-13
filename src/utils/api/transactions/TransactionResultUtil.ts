import { enumType } from "@pagopa/ts-commons/lib/types";
import * as t from "io-ts";
import { TransactionStatusEnum } from "../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionStatus";
import {
  TransactionInfoGatewayInfo,
  SendPaymentResultOutcomeEnum,
  TransactionInfoNodeInfoClosePaymentResultError,
} from "../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionInfo";
import {
  gatewayAuthorizationStatusType,
  ViewOutcomeEnum,
  PaymentGateway,
  NpgResultCodeEnum,
  RedirectResultCodeEnum,
  transactionInfoStatus,
} from "./types";
import {
  getClosePaymentErrorsMap,
  IClosePaymentErrorItem,
} from "./transactionClosePaymentErrorUtil";

export const authorizationStatusMap = new Map<
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
  ["121", ViewOutcomeEnum.LIMIT_EXCEEDED],
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
): ViewOutcomeEnum => {
  if (transactionInfo?.nodeInfo?.closePaymentResultError) {
    return evaluateClosePaymentResultError(
      transactionInfo?.nodeInfo?.closePaymentResultError
    );
  }
  switch (transactionInfo.status) {
    case TransactionStatusEnum.NOTIFIED_OK:
      return ViewOutcomeEnum.SUCCESS;
    case TransactionStatusEnum.NOTIFICATION_REQUESTED:
    case TransactionStatusEnum.NOTIFICATION_ERROR:
      return transactionInfo?.nodeInfo?.sendPaymentResultOutcome ===
        SendPaymentResultOutcomeEnum.OK
        ? ViewOutcomeEnum.SUCCESS
        : ViewOutcomeEnum.PSP_ERROR;
    case TransactionStatusEnum.REFUND_REQUESTED:
    case TransactionStatusEnum.REFUND_ERROR:
      return ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.REFUNDED:
    case TransactionStatusEnum.NOTIFIED_KO:
      return ViewOutcomeEnum.PSP_ERROR;
    case TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED:
      return ViewOutcomeEnum.TIMEOUT;
    case TransactionStatusEnum.CANCELED:
    case TransactionStatusEnum.CANCELLATION_EXPIRED:
      return ViewOutcomeEnum.CANCELED_BY_USER;
    case TransactionStatusEnum.CLOSURE_REQUESTED:
      return !wasAuthorizedByGateway(transactionInfo.gatewayInfo)
        ? evaluateUnauthorizedStatus(transactionInfo.gatewayInfo)
        : ViewOutcomeEnum.TAKE_IN_CHARGE;
    case TransactionStatusEnum.CLOSURE_ERROR:
    case TransactionStatusEnum.AUTHORIZATION_COMPLETED:
      return !wasAuthorizedByGateway(transactionInfo.gatewayInfo)
        ? evaluateUnauthorizedStatus(transactionInfo.gatewayInfo)
        : ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.UNAUTHORIZED:
      return !wasAuthorizedByGateway(transactionInfo.gatewayInfo)
        ? evaluateUnauthorizedStatus(transactionInfo.gatewayInfo)
        : ViewOutcomeEnum.PSP_ERROR;
    case TransactionStatusEnum.CLOSED:
      return transactionInfo?.nodeInfo?.sendPaymentResultOutcome ===
        SendPaymentResultOutcomeEnum.NOT_RECEIVED
        ? ViewOutcomeEnum.TAKE_IN_CHARGE
        : ViewOutcomeEnum.GENERIC_ERROR;
    case TransactionStatusEnum.EXPIRED: {
      if (transactionInfo?.gatewayInfo?.authorizationStatus == null) {
        return ViewOutcomeEnum.TAKE_IN_CHARGE;
      } else if (!wasAuthorizedByGateway(transactionInfo.gatewayInfo)) {
        return evaluateUnauthorizedStatus(transactionInfo.gatewayInfo);
      } else {
        switch (transactionInfo?.nodeInfo?.sendPaymentResultOutcome) {
          case SendPaymentResultOutcomeEnum.OK:
            return ViewOutcomeEnum.SUCCESS;
          case SendPaymentResultOutcomeEnum.KO:
            return ViewOutcomeEnum.PSP_ERROR;
          case SendPaymentResultOutcomeEnum.NOT_RECEIVED:
            return ViewOutcomeEnum.TAKE_IN_CHARGE;
          default:
            return ViewOutcomeEnum.GENERIC_ERROR; // BE_KO(99)
        }
      }
    }
    case TransactionStatusEnum.AUTHORIZATION_REQUESTED:
      return ViewOutcomeEnum.TAKE_IN_CHARGE;
    default:
      return ViewOutcomeEnum.GENERIC_ERROR;
  }
};

export const wasAuthorizedByGateway = (
  gatewayInfo?: TransactionInfoGatewayInfo
): boolean => {
  if (gatewayInfo === undefined) {
    return false;
  }

  switch (gatewayInfo.gateway) {
    case PaymentGateway.NPG:
      return gatewayInfo.authorizationStatus === NpgResultCodeEnum.EXECUTED;
    case PaymentGateway.REDIRECT:
      return gatewayInfo.authorizationStatus === RedirectResultCodeEnum.OK;
    default:
      return false;
  }
};

function evaluateUnauthorizedStatus(
  gatewayInfo?: TransactionInfoGatewayInfo
): ViewOutcomeEnum {
  if (gatewayInfo === undefined) {
    return ViewOutcomeEnum.GENERIC_ERROR;
  }

  switch (gatewayInfo.gateway) {
    case PaymentGateway.NPG:
      switch (gatewayInfo.authorizationStatus) {
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
            authorizationStatusMap.get(
              gatewayInfo.errorCode as gatewayAuthorizationStatusType
            ) || ViewOutcomeEnum.PSP_ERROR
          );
        default:
          return ViewOutcomeEnum.PSP_ERROR;
      }
    case PaymentGateway.REDIRECT:
      switch (gatewayInfo.authorizationStatus) {
        case RedirectResultCodeEnum.KO:
          return ViewOutcomeEnum.AUTH_ERROR;
        case RedirectResultCodeEnum.CANCELED:
          return ViewOutcomeEnum.CANCELED_BY_USER;
        case RedirectResultCodeEnum.ERROR:
          return ViewOutcomeEnum.PSP_ERROR;
        case RedirectResultCodeEnum.EXPIRED:
          return ViewOutcomeEnum.PSP_ERROR;
        default:
          return ViewOutcomeEnum.PSP_ERROR;
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

/**
 * This function will match any status code from closePaymentResultError with any
 * status code defined in the ClosePaymentErrorsMap item.
 *
 * NOTE:
 * ClosePaymentErrorsMap supports placeholders, so 5xx will match any error >= 500
 */
function evaluateClosePaymentResultError(
  closePaymentResultError?: TransactionInfoNodeInfoClosePaymentResultError
): ViewOutcomeEnum {
  // NOTE: this should never happen by design,
  // is only added just to be sure
  if (closePaymentResultError === undefined) {
    return ViewOutcomeEnum.GENERIC_ERROR;
  }

  function matchStatusCode(numericCode: number, statusCode: string) {
    const numericCodeStr = numericCode.toString();
    const regex = new RegExp("^" + statusCode.replace(/x/g, "\\d") + "$");
    return regex.test(numericCodeStr);
  }
  // find the proper error output configuration based on the closePaymentResultError
  const matchingItem: IClosePaymentErrorItem | undefined =
    getClosePaymentErrorsMap().find(
      (x: IClosePaymentErrorItem) =>
        matchStatusCode(
          closePaymentResultError?.statusCode ?? 0,
          x.statusCode
        ) &&
        (x.enablingDescriptions === undefined ||
          x.enablingDescriptions.includes(
            closePaymentResultError?.description as string
          ))
    );

  // return outcome
  if (matchingItem) {
    return matchingItem.outcome;
  }

  // default
  return ViewOutcomeEnum.GENERIC_ERROR;
}
