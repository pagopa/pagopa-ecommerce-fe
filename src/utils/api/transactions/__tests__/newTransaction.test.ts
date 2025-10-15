import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { getSessionItem, SessionItems } from "../../../storage/sessionStorage";
import { ecommerceIOClientWithPollingV1 } from "../../../api/client";
import { ecommerceIOPostTransaction } from "../newTransaction";
import { NodeFaultCode } from "../nodeFaultCode";

// Mock the dependencies
jest.mock("../../../storage/sessionStorage", () => ({
  getSessionItem: jest.fn(),
  SessionItems: {
    rptId: "rptId",
    amount: "amount",
  },
}));

jest.mock("../../../api/client", () => ({
  ecommerceIOClientWithPollingV1: {
    newTransactionForEcommerceWebview: jest.fn(),
  },
}));

describe("ecommerceIOPostTransaction", () => {
  const mockRptId = "mock-rpt-id";
  const mockAmount = 1000; // in cents
  const mockToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionItem as jest.Mock).mockImplementation((key) => {
      if (key === SessionItems.rptId) {
        return mockRptId;
      }
      if (key === SessionItems.amount) {
        return mockAmount;
      }
      return null;
    });
  });

  it("returns response when transaction succeeds with status 200", async () => {
    const mockResponse = { status: 200, value: { transactionId: "123" } };

    // Wrap the response in Right to match E.match in the function
    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostTransaction(mockToken)();
    expect(pipe(result)).toEqual(E.of(mockResponse.value));
  });

  it("returns TaskEither left handling response with status code 400 with fault code category GENERIC_ERROR", async () => {
    const mockResponse = { status: 400, value: {} };

    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostTransaction(mockToken)();

    expect(result).toEqual(E.left({ faultCodeCategory: "GENERIC_ERROR" }));
  });

  it("returns TaskEither left handling response with status code 401 with fault code category GENERIC_ERROR", async () => {
    const mockResponse = { status: 401, value: {} };

    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostTransaction(mockToken)();

    expect(result).toEqual(
      E.left({
        faultCodeCategory: "SESSION_EXPIRED",
        faultCodeDetail: "Unauthorized",
      } as NodeFaultCode)
    );
  });
  const transactionsServiceNodeErrorOnActivateHttpResponseCodes = [
    404, 409, 502, 503,
  ];
  it.each(transactionsServiceNodeErrorOnActivateHttpResponseCodes)(
    "returns TaskEither left handling response with status code %s returning Node fault category and details",
    async (httpErrorCode) => {
      const faultCodeCategory = "PAYMENT_UNAVAILABLE";
      const faultCodeDetail = "PPT_DOMINIO_SCONOSCIUTO";
      const mockResponse = {
        status: httpErrorCode,
        value: { faultCodeCategory, faultCodeDetail },
      };

      (
        ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
      ).mockResolvedValue(E.right(mockResponse));

      const result = await ecommerceIOPostTransaction(mockToken)();

      expect(result).toEqual(
        E.left({
          faultCodeCategory,
          faultCodeDetail,
        })
      );
    }
  );

  it.each(transactionsServiceNodeErrorOnActivateHttpResponseCodes)(
    "returns TaskEither left handling response with status code %s handling missing node return details",
    async (httpErrorCode) => {
      const mockResponse = { status: httpErrorCode, value: {} };

      (
        ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
      ).mockResolvedValue(E.right(mockResponse));

      const result = await ecommerceIOPostTransaction(mockToken)();

      expect(result).toEqual(
        E.left({
          faultCodeCategory: "GENERIC_ERROR",
          faultCodeDetail: "Unknown error",
        })
      );
    }
  );

  it("returns None when the client throws an error", async () => {
    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockRejectedValue(new Error("Network error"));

    const result = await ecommerceIOPostTransaction(mockToken)();

    expect(result).toEqual(E.left({ faultCodeCategory: "GENERIC_ERROR" }));
  });

  it("returns None when session items are missing", async () => {
    (getSessionItem as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const result = await ecommerceIOPostTransaction(mockToken)();

    expect(result).toEqual(E.left({ faultCodeCategory: "GENERIC_ERROR" }));
  });
});
