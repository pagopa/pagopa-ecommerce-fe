import { getOnboardingPaymentOutcome } from "../api/transactions/TransactionResultUtil";
import {
  NpgResultCodeEnum,
  PaymentGateway,
  RedirectResultCodeEnum,
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

  it.each([
    {
      gatewayOutcome: RedirectResultCodeEnum.OK,
      expectedOutcome: "1",
    },
    {
      gatewayOutcome: RedirectResultCodeEnum.KO,
      expectedOutcome: "2",
    },
    {
      gatewayOutcome: RedirectResultCodeEnum.CANCELED,
      expectedOutcome: "8",
    },
    {
      gatewayOutcome: RedirectResultCodeEnum.EXPIRED,
      expectedOutcome: "4",
    },
    {
      gatewayOutcome: RedirectResultCodeEnum.ERROR,
      expectedOutcome: "1",
    },
  ])("maps REDIRECT outcome properly for test data: %s", (testData) => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        sendPaymentResultOutcome: undefined,
        gatewayAuthorizationStatus: testData.gatewayOutcome,
        gateway: PaymentGateway.REDIRECT,
      })
    ).toBe(testData.expectedOutcome);
  });

  it("returns TAKE_IN_CHARGE for transaction locked in AUTHORIZATION_REQUESTED", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.TAKING_CHARGE);
  });
});
