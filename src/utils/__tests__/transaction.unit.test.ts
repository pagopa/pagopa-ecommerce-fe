import { getOnboardingPaymentOutcome } from "../api/transactions/TransactionResultUtil";
import {
  NpgResultCodeEnum,
  PaymentGateway,
  ViewOutcomeEnum,
} from "../api/transactions/types";
import { TransactionStatusEnum } from "../../../generated/definitions/payment-ecommerce-webview/TransactionStatus";
import { SendPaymentResultOutcomeEnum } from "../../../generated/definitions/payment-ecommerce-webview/NewTransactionResponse";

describe("Onboarding Payment Outcome mapping", () => {
  it("returns SUCCESS", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_OK,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);
  });

  it("returns GENERIC_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.AUTHORIZATION_COMPLETED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSURE_REQUESTED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSURE_ERROR,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_KO,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_REQUESTED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_ERROR,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUNDED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });
});
