import {
  authorizationStatusMap,
  getOnboardingPaymentOutcome,
  wasAuthorizedByGateway,
  EcommerceInterruptStatusCodeEnumType,
  EcommerceMaybeInterruptStatusCodeEnumType,
} from "../TransactionResultUtil";
import {
  ViewOutcomeEnum,
  PaymentGateway,
  NpgResultCodeEnum,
  RedirectResultCodeEnum,
} from "../types";
import { TransactionStatusEnum } from "../../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionStatus";
import { SendPaymentResultOutcomeEnum } from "../../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionInfo";

describe("authorizationStatusMap", () => {
  it("contains expected codes and outcomes", () => {
    expect(authorizationStatusMap.size).toBeGreaterThan(0);
    expect(authorizationStatusMap.get("101")).toBe(
      ViewOutcomeEnum.INVALID_CARD
    );
    expect(authorizationStatusMap.get("116")).toBe(
      ViewOutcomeEnum.BALANCE_LIMIT
    );
    expect(authorizationStatusMap.get("904")).toBe(ViewOutcomeEnum.PSP_ERROR);
  });
  it("does not map unknown codes", () => {
    expect(authorizationStatusMap.get("000" as any)).toBeUndefined();
  });
});

describe("wasAuthorizedByGateway()", () => {
  it("returns true for NPG with EXECUTED", () => {
    expect(
      wasAuthorizedByGateway({
        gateway: PaymentGateway.NPG,
        authorizationStatus: NpgResultCodeEnum.EXECUTED,
      })
    ).toBe(true);
  });
  it("returns false for NPG with non-EXECUTED", () => {
    expect(
      wasAuthorizedByGateway({
        gateway: PaymentGateway.NPG,
        authorizationStatus: NpgResultCodeEnum.PENDING,
      })
    ).toBe(false);
  });
  it("returns true for REDIRECT with OK", () => {
    expect(
      wasAuthorizedByGateway({
        gateway: PaymentGateway.REDIRECT,
        authorizationStatus: RedirectResultCodeEnum.OK,
      })
    ).toBe(true);
  });
  it("returns false for REDIRECT with non-OK", () => {
    expect(
      wasAuthorizedByGateway({
        gateway: PaymentGateway.REDIRECT,
        authorizationStatus: RedirectResultCodeEnum.ERROR,
      })
    ).toBe(false);
  });
  it("returns false for undefined info", () => {
    expect(wasAuthorizedByGateway(undefined)).toBe(false);
  });
});

describe("getOnboardingPaymentOutcome()", () => {
  const baseInfo = {
    gatewayInfo: {
      gateway: PaymentGateway.NPG,
      authorizationStatus: NpgResultCodeEnum.EXECUTED,
    },
    nodeInfo: {} as any,
  };

  it("returns SUCCESS on NOTIFIED_OK", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_OK,
        ...baseInfo,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);
  });

  it("returns GENERIC_ERROR for REFUND_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_ERROR,
        ...baseInfo,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it("handles closed with NOT_RECEIVED as TAKE_IN_CHARGE", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gatewayInfo: baseInfo.gatewayInfo,
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED,
        },
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);
  });

  it("handles expired without auth status as TAKE_IN_CHARGE", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: { gateway: PaymentGateway.NPG },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);
  });

  it("handles expired with OK as SUCCESS", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: baseInfo.gatewayInfo,
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK },
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);
  });

  it("handles notification error with KO as PSP_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        gatewayInfo: baseInfo.gatewayInfo,
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO },
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);
  });
});

describe("closePaymentResultError branch", () => {
  it("delegates to evaluateClosePaymentResultError when authorized", () => {
    // 422 + matching description should return REFUNDED
    const outcome = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.CLOSED,
      gatewayInfo: {
        gateway: PaymentGateway.NPG,
        authorizationStatus: NpgResultCodeEnum.EXECUTED,
      },
      nodeInfo: {
        closePaymentResultError: {
          statusCode: 422,
          description: "Node did not receive RPT yet",
        },
      },
    });
    expect(outcome).toBe(ViewOutcomeEnum.REFUNDED);
  });

  it("falls back to GENERIC_ERROR if no match", () => {
    const outcome = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.CLOSED,
      gatewayInfo: {
        gateway: PaymentGateway.NPG,
        authorizationStatus: NpgResultCodeEnum.EXECUTED,
      },
      nodeInfo: {
        closePaymentResultError: { statusCode: 599, description: "other" },
      },
    });
    expect(outcome).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it("calls evaluateUnauthorizedStatus when not authorized", () => {
    const outcome = getOnboardingPaymentOutcome({
      status: TransactionStatusEnum.CLOSED,
      gatewayInfo: {
        gateway: PaymentGateway.REDIRECT,
        authorizationStatus: RedirectResultCodeEnum.ERROR,
      },
      nodeInfo: {
        closePaymentResultError: { statusCode: 400, description: "ignored" },
      },
    });
    expect(outcome).toBe(ViewOutcomeEnum.PSP_ERROR);
  });
});

describe("io-ts enum codecs", () => {
  it("EcommerceInterruptStatusCodeEnumType decodes valid value", () => {
    const r = EcommerceInterruptStatusCodeEnumType.decode(
      TransactionStatusEnum.REFUNDED as any
    );
    // eslint-disable-next-line no-underscore-dangle
    expect(r._tag).toBe("Right");
  });
  it("fails to decode invalid value", () => {
    const r = EcommerceInterruptStatusCodeEnumType.decode(999 as any);
    // eslint-disable-next-line no-underscore-dangle
    expect(r._tag).toBe("Left");
  });

  it("EcommerceMaybeInterruptStatusCodeEnumType decodes valid value", () => {
    const r = EcommerceMaybeInterruptStatusCodeEnumType.decode(
      TransactionStatusEnum.CLOSURE_ERROR as any
    );
    // eslint-disable-next-line no-underscore-dangle
    expect(r._tag).toBe("Right");
  });
});
