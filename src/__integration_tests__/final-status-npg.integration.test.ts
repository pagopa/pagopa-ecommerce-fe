import "expect-puppeteer";

describe("Unauthorized npg final status mapping tests", () => {
  /**
     * Test input and configuration
  */

  const ECOMMERCE_FE_ESITO_PAGE = "http://localhost:1234/ecommerce-fe/esito#clientId=CHECKOUT&sessionToken=test&transactionId=1234";

  /**
   * Add all mock flow. Reference to the flow defined into the checkout be mock
   */
  const mockFlowWithExpectedResultMap = new Map([
    [
      "AUTHORIZATION_REQUESTED_NO_NPG_OUTCOME",
      "17"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_EXECUTED",
      "1"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_AUTHORIZED",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_PENDING",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_VOIDED",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_REFUNDED",
     "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_FAILED",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101",
      "7"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104",
      "3"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110",
      "3"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111",
     "7"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116",
      "116"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117",
      "117"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118",
      "3"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121",
      "121"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125",
      "3"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204",
      "2"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208",
      "3"
    ],

    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209",
      "3"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210",
      "3"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED",
      "17"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_AUTHORIZED",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_PENDING",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_VOIDED",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_REFUNDED",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_FAILED",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101",
      "7"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104",
      "3"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110",
      "3"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111",
      "7"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116",
      "116"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117",
      "117"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118",
      "3"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121",
      "121"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125",
      "3"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204",
      "2"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208",
     "3"
    ],

    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209",
      "3"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210",
      "3"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907",
     "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908",
     "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911",
     "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED",
      "1"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_AUTHORIZED",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_PENDING",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_VOIDED",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_REFUNDED",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_FAILED",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_THREEDS_FAILED",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101",
      "7"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104",
      "3"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110",
      "3"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111",
      "7"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116",
      "116"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117",
      "117"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118",
      "3"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121",
      "121"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125",
      "3"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204",
      "2"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208",
      "3"
    ],

    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209",
      "3"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210",
      "3"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC",
      "25"
    ],
    [
      "CLOSED_WITH_NPG_AUTH_STATUS_EXECUTED_SEND_PAYMENT_RESULT_NOT_RECEIVED",
      "17"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_AUTHORIZED",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_PENDING",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_VOIDED",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_REFUNDED",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_FAILED",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101",
      "7"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104",
      "3"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110",
      "3"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111",
     "7"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116",
      "116"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117",
      "117"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118",
      "3"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121",
      "121"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125",
      "3"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204",
      "2"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208",
      "3"
    ],

    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209",
     "3"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210",
     "3"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC",
      "25"
    ],
    [
      "NOTIFICATION_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "NOTIFICATION_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "NOTIFICATION_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "NOTIFICATION_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "NOTIFIED_OK_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "NOTIFIED_KO_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_REQUESTED",
      "17"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_EXECUTED",
      "1"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_AUTHORIZED",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_PENDING",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_VOIDED",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_REFUNDED",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_FAILED",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DENIED_BY_RISK",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_THREEDS_VALIDATED",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_THREEDS_FAILED",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_100",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_101",
      "7"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_102",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_104",
      "3"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_106",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_109",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_110",
      "3"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_111",
      "7"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_115",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_116",
      "116"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_117",
      "117"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_118",
      "3"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_119",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_120",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_121",
      "121"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_122",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_123",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_124",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_125",
      "3"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_126",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_129",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_200",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_202",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_204",
      "2"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_208",
      "3"
    ],

    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_209",
      "3"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_210",
      "3"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_413",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_888",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_902",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_903",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_904",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_906",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_907",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_908",
     "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_909",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_911",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_913",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_999",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_CLOSURE_REQUESTED_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED",
      "17"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_CLOSURE_ERROR_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED",
      "17"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_NOTIFICATION_ERROR_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_FOR_NOTIFICATION_ERROR_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "REFUND_REQUESTED_TRANSACTION_WITH_NPG_AUTH_STATUS_EXECUTED",
      "1"
    ],
    [
      "REFUND_ERROR_TRANSACTION_WITH_NPG_AUTH_STATUS_EXECUTED",
      "1"
    ],
    [
      "REFUNDED_TRANSACTION_WITH_NPG_AUTH_STATUS_EXECUTED",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_OK",
      "1"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_KO",
      "2"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_ERROR",
      "25"
    ],
    [
      "AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_EXPIRED",
     "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_OK",
      "17"
    ],
    [
      "CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_KO",
      "2"
    ],
    [
      "CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_ERROR",
      "25"
    ],
    [
      "CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_EXPIRED",
     "25"
    ],
    [
      "CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_OK",
      "1"
    ],
    [
      "CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_KO",
      "2"
    ],
    [
      "CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_ERROR",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_EXPIRED",
     "25"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_OK",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_KO",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_ERROR",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_EXPIRED",
     "25"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_OK",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_KO",
      "2"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_ERROR",
      "25"
    ],
    [
      "UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_EXPIRED",
     "25"
    ],
    [
      "NOTIFICATION_REQUESTED_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "NOTIFICATION_REQUESTED_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "NOTIFICATION_ERROR_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "NOTIFICATION_ERROR_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "NOTIFIED_OK_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "NOTIFIED_KO_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_OK",
      "1"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_KO",
      "2"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_CANCELED",
      "8"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_EXPIRED",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_ERROR",
      "25"
    ],    
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_CLOSURE_REQUESTED_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED",
      "17"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_CLOSURE_ERROR_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED",
      "17"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_ERROR_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK",
      "0"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO",
      "25"
    ],
    [
      "EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_ERROR_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO",
      "1"
    ],
    [
      "REFUND_REQUESTED_TRANSACTION_WITH_REDIRECT_AUTH_STATUS_OK",
      "1"
    ],
    [
      "REFUND_ERROR_TRANSACTION_WITH_REDIRECT_AUTH_STATUS_OK",
      "1"
    ],
    [
      "REFUNDED_TRANSACTION_WITH_REDIRECT_AUTH_STATUS_OK",
      "25"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_422_DID_NOT_RECEIVE_RPT",
      "18"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_422_OUTCOME_ALREADY_ACQUIRED",
      "1"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_400_REFUND_CASES",
      "18"
    ],
    [
      "CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_404_REFUND_CASES",
      "18"
    ]
  ]);


  /**
   * Increase default test timeout (80000ms)
   * to support entire payment flow
    */
  jest.setTimeout(120000);
  jest.retryTimes(0);
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(120000);

  beforeAll(async () => {
    await page.goto(ECOMMERCE_FE_ESITO_PAGE);
    await page.setViewport({ width: 1200, height: 907 });
  })


  for (const [test, expectedOutcome] of mockFlowWithExpectedResultMap) {
    it(`${test} with expected outcome: ${expectedOutcome}`, async() => {
      console.log(`Executing test: [${test}]. expected outcome: [${expectedOutcome}]`);
      await page.setCookie({ name: "mockFlow", value: test });
      await page.goto(ECOMMERCE_FE_ESITO_PAGE);
      await page.waitForFunction("window.location.pathname.includes('v2/esito')")
      const pollingOutcome = Number.parseInt(page.url().split("outcome=")[1]);
      expect(pollingOutcome).toBe(Number.parseInt(expectedOutcome));
    })
  }
});