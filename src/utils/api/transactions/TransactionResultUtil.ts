import { TransactionOutcomeInfo } from "../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionOutcomeInfo";
import { ViewOutcomeEnum } from "./types";

export const getOutcome = (
  transactionOutcomeInfo: TransactionOutcomeInfo
): ViewOutcomeEnum =>
  transactionOutcomeInfo.outcome.toString() as ViewOutcomeEnum;
