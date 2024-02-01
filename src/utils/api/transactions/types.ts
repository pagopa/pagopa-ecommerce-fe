import * as t from "io-ts";
import { enumType } from "@pagopa/ts-commons/lib/types";

export enum PaymentGateway {
  NPG = "NPG",
}

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

export enum NpgResultCodeEnum {
  AUTHORIZED = "AUTHORIZED",
  EXECUTED = "EXECUTED",
  DECLINED = "DECLINED",
  DENIED_BY_RISK = "DENIED_BY_RISK",
  THREEDS_VALIDATED = "THREEDS_VALIDATED",
  THREEDS_FAILED = "THREEDS_FAILED",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  VOIDED = "VOIDED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export type gatewayAuthorizationStatusType =
  | "000"
  | "100"
  | "101"
  | "102"
  | "104"
  | "106"
  | "109"
  | "110"
  | "111"
  | "115"
  | "116"
  | "117"
  | "118"
  | "119"
  | "120"
  | "121"
  | "122"
  | "123"
  | "124"
  | "125"
  | "126";

export type EcommerceFinalStatusCodeEnumType = t.TypeOf<
  typeof EcommerceFinalStatusCodeEnumType
>;
export const EcommerceFinalStatusCodeEnumType =
  enumType<EcommerceFinalStatusCodeEnum>(
    EcommerceFinalStatusCodeEnum,
    "EcommerceFinalStatusCodeEnumType"
  );
