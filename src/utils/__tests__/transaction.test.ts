import { getOnboardingPaymentOutcome } from "../api/transactions/TransactionResultUtil";
import {
  NpgResultCodeEnum,
  PaymentGateway,
  ViewOutcomeEnum,
} from "../api/transactions/types";
import { TransactionStatusEnum } from "../../../generated/definitions/payment-ecommerce-webview/TransactionStatus";
import { SendPaymentResultOutcomeEnum } from "../../../generated/definitions/payment-ecommerce-webview/NewTransactionResponse";

describe("Onboarding Payment Outcome mapping", () => {
  it("returns SUCCESS in 4 use cases", () => {
    const result1 = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.NOTIFIED_OK,
    });
    expect(result1).toBe(ViewOutcomeEnum.SUCCESS);

    const result2 = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.NOTIFICATION_ERROR,
      sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
    });
    expect(result2).toBe(ViewOutcomeEnum.SUCCESS);

    const result3 = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.UNAUTHORIZED,
      errorCode: NpgResultCodeEnum.EXECUTED,
      gateway: PaymentGateway.NPG,
    });
    expect(result3).toBe(ViewOutcomeEnum.SUCCESS);

    const result4 = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.UNAUTHORIZED,
      errorCode: NpgResultCodeEnum.DECLINED,
      gateway: PaymentGateway.NPG,
      gatewayAuthorizationStatus: "000",
    });
    expect(result4).toBe(ViewOutcomeEnum.SUCCESS);
  });

  it("returns GENERIC_ERROR", () => {
    const GenericTransactionErrorStatuses = [
      TransactionStatusEnum.NOTIFIED_KO,
      TransactionStatusEnum.REFUNDED,
      TransactionStatusEnum.REFUND_REQUESTED,
      TransactionStatusEnum.REFUND_ERROR,
      TransactionStatusEnum.CLOSURE_ERROR,
      TransactionStatusEnum.EXPIRED,
      TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED,
      TransactionStatusEnum.CANCELED,
      TransactionStatusEnum.CANCELLATION_EXPIRED,
      TransactionStatusEnum.CLOSED,
    ];

    GenericTransactionErrorStatuses.map((genericErrorStatus) =>
      expect(getOnboardingPaymentOutcome({ status: genericErrorStatus })).toBe(
        ViewOutcomeEnum.GENERIC_ERROR
      )
    );

    expect(getOnboardingPaymentOutcome({})).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: "NOT_MAPPED_STATUS_TEST" as TransactionStatusEnum,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    const GenericErrorCodeStatuses = [
      NpgResultCodeEnum.AUTHORIZED,
      NpgResultCodeEnum.PENDING,
      NpgResultCodeEnum.VOIDED,
      NpgResultCodeEnum.REFUNDED,
      NpgResultCodeEnum.FAILED,
    ];
    GenericErrorCodeStatuses.map((genericErrorCodeStatus) =>
      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.UNAUTHORIZED,
          errorCode: genericErrorCodeStatus,
        })
      ).toBe(ViewOutcomeEnum.GENERIC_ERROR)
    );

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        errorCode: "NOT_MAPPED_ERROR_CODE_TEST" as NpgResultCodeEnum,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        errorCode: NpgResultCodeEnum.DECLINED,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        errorCode: NpgResultCodeEnum.DECLINED,
        gatewayAuthorizationStatus: "NOT_MAPPED_GATEWAY_CODE_TEST",
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    const GenericErrorGatewayStatuses = ["109", "115"];
    GenericErrorGatewayStatuses.map((genericErrorGatewayStatus) =>
      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.UNAUTHORIZED,
          errorCode: NpgResultCodeEnum.DECLINED,
          gatewayAuthorizationStatus: genericErrorGatewayStatus,
        })
      ).toBe(ViewOutcomeEnum.GENERIC_ERROR)
    );
  });

  it("returns AUTH_ERROR", () => {
    const AuthErrorCodeStatuses = [
      NpgResultCodeEnum.DENIED_BY_RISK,
      NpgResultCodeEnum.THREEDS_VALIDATED,
      NpgResultCodeEnum.THREEDS_FAILED,
    ];
    AuthErrorCodeStatuses.map((authErrorCodeStatus) =>
      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.UNAUTHORIZED,
          errorCode: authErrorCodeStatus,
          gateway: PaymentGateway.NPG,
        })
      ).toBe(ViewOutcomeEnum.AUTH_ERROR)
    );

    const AuthGatewayCodeStatuses = [
      "100",
      "102",
      "106",
      "116",
      "117",
      "119",
      "120",
      "121",
      "122",
      "123",
      "124",
      "126",
    ];
    AuthGatewayCodeStatuses.map((authGatewayCodeStatus) =>
      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.UNAUTHORIZED,
          errorCode: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          gatewayAuthorizationStatus: authGatewayCodeStatus,
        })
      ).toBe(ViewOutcomeEnum.AUTH_ERROR)
    );
  });
});
