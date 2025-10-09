import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { getSessionItem, SessionItems } from "../../../storage/sessionStorage";
import { ecommerceIOClientWithPollingV1 } from "../../../api/client";
import { ecommerceIOPostTransaction } from "../newTransaction";

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

  it("returns Some(response) when transaction succeeds with status 200", async () => {
    const mockResponse = { status: 200, value: { transactionId: "123" } };

    // Wrap the response in Right to match E.match in the function
    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostTransaction(mockToken);

    expect(result).toEqual(O.some(mockResponse.value));
  });

  it("returns None when transaction response status is not 200", async () => {
    const mockResponse = { status: 400, value: {} };

    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostTransaction(mockToken);

    expect(result).toEqual(O.none);
  });

  it("returns None when the client throws an error", async () => {
    (
      ecommerceIOClientWithPollingV1.newTransactionForEcommerceWebview as jest.Mock
    ).mockRejectedValue(new Error("Network error"));

    const result = await ecommerceIOPostTransaction(mockToken);

    expect(result).toEqual(O.none);
  });

  it("returns None when session items are missing", async () => {
    (getSessionItem as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const result = await ecommerceIOPostTransaction(mockToken);

    expect(result).toEqual(O.none);
  });
});
