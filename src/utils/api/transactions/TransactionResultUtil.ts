import * as t from "io-ts";
import { enumType } from "@pagopa/ts-commons/lib/types";
import { TransactionStatusEnum } from "../../../../generated/definitions/payment-ecommerce-IO/TransactionStatus";

export enum ViewOutcomeEnum {
  SUCCESS = "0",
  GENERIC_ERROR = "1",
  AUTH_ERROR = "2",
  INVALID_DATA = "3",
  TIMEOUT = "4",
  INVALID_CARD = "7",
  CANCELED_BY_USER = "8",
  EXCESSIVE_AMOUNT = "10",
  TAKING_CHARGE = "15",
}

export enum EcommerceFinalStatusCodeEnum {
  NOTIFIED_OK,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_ERROR,
  NOTIFIED_KO,
  REFUNDED,
  REFUND_REQUESTED,
  REFUND_ERROR,
  CLOSURE_ERROR,
  EXPIRED_NOT_AUTHORIZED,
  CANCELED,
  CANCELLATION_EXPIRED,
  CANCELED_BY_USER,
  UNAUTHORIZED,
  EXPIRED,
}

export type EcommerceFinalStatusCodeEnumType = t.TypeOf<
  typeof EcommerceFinalStatusCodeEnumType
>;
export const EcommerceFinalStatusCodeEnumType =
  enumType<EcommerceFinalStatusCodeEnum>(
    EcommerceFinalStatusCodeEnum,
    "EcommerceFinalStatusCodeEnumType"
  );

export const getOnboardingPaymentOutcome = (
  transactionStatus?: TransactionStatusEnum
): ViewOutcomeEnum => {
  switch (transactionStatus) {
    case TransactionStatusEnum.NOTIFIED_OK:
      return ViewOutcomeEnum.SUCCESS;
    case TransactionStatusEnum.NOTIFICATION_REQUESTED:
    case TransactionStatusEnum.NOTIFICATION_ERROR:
    case TransactionStatusEnum.NOTIFIED_KO:
    case TransactionStatusEnum.REFUNDED:
    case TransactionStatusEnum.REFUND_REQUESTED:
    case TransactionStatusEnum.REFUND_ERROR:
    case TransactionStatusEnum.CLOSURE_ERROR:
    case TransactionStatusEnum.EXPIRED:
    case TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED:
    case TransactionStatusEnum.CANCELED:
    case TransactionStatusEnum.CANCELLATION_EXPIRED:
    case TransactionStatusEnum.UNAUTHORIZED:
    case TransactionStatusEnum.CLOSED:
      return ViewOutcomeEnum.GENERIC_ERROR;
    default:
      return ViewOutcomeEnum.GENERIC_ERROR;
  }
};
