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
  it.each([
    {
      gateway: PaymentGateway.NPG,
      authorizationStatusOK: NpgResultCodeEnum.EXECUTED,
    },
    {
      gateway: PaymentGateway.REDIRECT,
      authorizationStatusOK: RedirectResultCodeEnum.OK,
    },
  ])("returns SUCCESS for testData: %s", (testData) => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_OK,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);
  });

  it.each([
    {
      gateway: PaymentGateway.NPG,
      authorizationStatusOK: NpgResultCodeEnum.EXECUTED,
    },
    {
      gateway: PaymentGateway.REDIRECT,
      authorizationStatusOK: RedirectResultCodeEnum.OK,
    },
  ])("returns GENERIC_ERROR for test data: %s", (testData) => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.AUTHORIZATION_COMPLETED,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSURE_ERROR,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_REQUESTED,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_ERROR,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gateway: testData.gateway,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gateway: testData.gateway,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it("returns GENERIC_ERROR for misconfigured data", () => {
    expect(getOnboardingPaymentOutcome({})).toBe(ViewOutcomeEnum.GENERIC_ERROR);
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gateway: "wrong",
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it.each([
    { gateway: PaymentGateway.NPG },
    { gateway: PaymentGateway.REDIRECT },
  ])("returns CANCELED_BY_USER for test data: %s", (testData) => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CANCELED,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.CANCELED_BY_USER);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CANCELLATION_EXPIRED,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.CANCELED_BY_USER);
  });

  it.each([
    {
      gateway: PaymentGateway.NPG,
      authorizationStatusOK: NpgResultCodeEnum.EXECUTED,
    },
    {
      gateway: PaymentGateway.REDIRECT,
      authorizationStatusOK: RedirectResultCodeEnum.OK,
    },
  ])("returns TAKE_IN_CHARGE for test data: %s", (testData) => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSURE_REQUESTED,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED,
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED,
        gatewayAuthorizationStatus: testData.authorizationStatusOK,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);
  });
  it.each([
    { gateway: PaymentGateway.NPG },
    { gateway: PaymentGateway.REDIRECT },
  ])("returns TIMEOUT for testData: %s", (testData) => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED,
        gateway: testData.gateway,
      })
    ).toBe(ViewOutcomeEnum.TIMEOUT);
  });

  it("returns PSP_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gateway: PaymentGateway.REDIRECT,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gateway: PaymentGateway.REDIRECT,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_KO,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_KO,
        gateway: PaymentGateway.REDIRECT,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUNDED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUNDED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.REDIRECT,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        gatewayAuthorizationStatus: NpgResultCodeEnum.EXECUTED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.AUTHORIZED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.PENDING,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.VOIDED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.REFUNDED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.FAILED,
        gateway: PaymentGateway.NPG,
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "wrongErrorCode",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "109",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "115",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "904",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "906",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "907",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "908",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "909",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "911",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "913",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "999",
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);
  });

  it("returns INVALID_CARD", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "101",
      })
    ).toBe(ViewOutcomeEnum.INVALID_CARD);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "111",
      })
    ).toBe(ViewOutcomeEnum.INVALID_CARD);
  });

  it("returns INVALID_DATA", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "104",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "110",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "118",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "125",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "208",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "209",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "210",
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);
  });

  it("returns AUTH_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "100",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "102",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "106",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "119",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "120",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "122",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "123",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "124",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "126",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "129",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "200",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "202",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "204",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "413",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "888",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "902",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "903",
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);
  });

  it("returns BALANCE_LIMIT", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "116",
      })
    ).toBe(ViewOutcomeEnum.BALANCE_LIMIT);
  });

  it("returns CVV_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "117",
      })
    ).toBe(ViewOutcomeEnum.CVV_ERROR);
  });

  it("returns LIMIT_EXCEEDED", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayAuthorizationStatus: NpgResultCodeEnum.DECLINED,
        gateway: PaymentGateway.NPG,
        errorCode: "121",
      })
    ).toBe(ViewOutcomeEnum.LIMIT_EXCEEDED);
  });

  it.each([
    { gateway: PaymentGateway.NPG },
    { gateway: PaymentGateway.REDIRECT },
  ])(
    "returns TAKE_IN_CHARGE for transaction locked in AUTHORIZATION_REQUESTED for test data: %s",
    (testData) => {
      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
          gateway: testData.gateway,
        })
      ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
          gateway: testData.gateway,
        })
      ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);
    }
  );

  it.each([
    {
      gatewayOutcome: RedirectResultCodeEnum.OK,
      expectedOutcome: "25",
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
      expectedOutcome: "25",
    },
    {
      gatewayOutcome: RedirectResultCodeEnum.ERROR,
      expectedOutcome: "25",
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
});
