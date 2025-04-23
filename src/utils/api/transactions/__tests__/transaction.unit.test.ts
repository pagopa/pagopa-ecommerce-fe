import { getOnboardingPaymentOutcome } from "../../../api/transactions/TransactionResultUtil";
import {
  NpgResultCodeEnum,
  PaymentGateway,
  RedirectResultCodeEnum,
  ViewOutcomeEnum,
} from "../../../api/transactions/types";
import { TransactionStatusEnum } from "../../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionStatus";
import { SendPaymentResultOutcomeEnum } from "../../../../../generated/definitions/payment-ecommerce-webview-v2/TransactionInfo";

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
        gatewayInfo: {
          gateway: testData.gateway,
          authorizationStatus: testData.authorizationStatusOK,
        },
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        },
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        },
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK,
        },
      })
    ).toBe(ViewOutcomeEnum.SUCCESS);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK },
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
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSURE_ERROR,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_REQUESTED,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUND_ERROR,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO },
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK },
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it("returns GENERIC_ERROR for misconfigured data", () => {
    expect(getOnboardingPaymentOutcome({})).toBe(ViewOutcomeEnum.GENERIC_ERROR);
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: { gateway: "wrong" },
        nodeInfo: {},
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
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.CANCELED_BY_USER);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CANCELLATION_EXPIRED,
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: {},
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
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.CLOSED,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED,
        },
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: {
          authorizationStatus: testData.authorizationStatusOK,
          gateway: testData.gateway,
        },
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED,
        },
      })
    ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: {},
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
        gatewayInfo: { gateway: testData.gateway },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.TIMEOUT);
  });

  it("returns PSP_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        gatewayInfo: { gateway: PaymentGateway.NPG },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO },
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_REQUESTED,
        gatewayInfo: { gateway: PaymentGateway.REDIRECT },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO },
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        gatewayInfo: { gateway: PaymentGateway.NPG },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO },
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFICATION_ERROR,
        gatewayInfo: { gateway: PaymentGateway.REDIRECT },
        nodeInfo: { sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO },
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_KO,
        gatewayInfo: { gateway: PaymentGateway.NPG },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.NOTIFIED_KO,
        gatewayInfo: { gateway: PaymentGateway.REDIRECT },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUNDED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.EXECUTED,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.REFUNDED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.EXECUTED,
          gateway: PaymentGateway.REDIRECT,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.EXPIRED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.EXECUTED,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {
          sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO,
        },
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.AUTHORIZED,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.PENDING,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.VOIDED,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.REFUNDED,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.FAILED,
          gateway: PaymentGateway.NPG,
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "wrongErrorCode",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "109",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "115",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "904",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "906",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "907",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "908",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "909",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "911",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "913",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "999",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.PSP_ERROR);
  });

  it("returns INVALID_CARD", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "101",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_CARD);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "111",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_CARD);
  });

  it("returns INVALID_DATA", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "104",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "110",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "118",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "125",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "208",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "209",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "210",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.INVALID_DATA);
  });

  it("returns AUTH_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "100",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "102",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "106",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "119",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "120",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "122",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "123",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "124",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "126",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "129",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "200",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "202",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "204",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "413",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "888",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "902",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);

    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "903",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.AUTH_ERROR);
  });

  it("returns BALANCE_LIMIT", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "116",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.BALANCE_LIMIT);
  });

  it("returns CVV_ERROR", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "117",
        },
        nodeInfo: {},
      })
    ).toBe(ViewOutcomeEnum.CVV_ERROR);
  });

  it("returns LIMIT_EXCEEDED", () => {
    expect(
      getOnboardingPaymentOutcome({
        status: TransactionStatusEnum.UNAUTHORIZED,
        gatewayInfo: {
          authorizationStatus: NpgResultCodeEnum.DECLINED,
          gateway: PaymentGateway.NPG,
          errorCode: "121",
        },
        nodeInfo: {},
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
          gatewayInfo: {
            gateway: testData.gateway,
          },
          nodeInfo: {},
        })
      ).toBe(ViewOutcomeEnum.TAKE_IN_CHARGE);

      expect(
        getOnboardingPaymentOutcome({
          status: TransactionStatusEnum.AUTHORIZATION_REQUESTED,
          gatewayInfo: { gateway: testData.gateway },
          nodeInfo: {},
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
        gatewayInfo: {
          authorizationStatus: testData.gatewayOutcome,
          gateway: PaymentGateway.REDIRECT,
        },
        nodeInfo: {
          sendPaymentResultOutcome: undefined,
        },
      })
    ).toBe(testData.expectedOutcome);
  });
});
