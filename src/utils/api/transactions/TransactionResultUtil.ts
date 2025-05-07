
import { TransactionOutcomeInfo } from "../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionOutcomeInfo";
import {
  gatewayAuthorizationStatusType,
  ViewOutcomeEnum,
} from "./types";

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

export const getOutcome = (
  transactionOutcomeInfo: TransactionOutcomeInfo
): ViewOutcomeEnum =>
  transactionOutcomeInfo.outcome.toString() as ViewOutcomeEnum;