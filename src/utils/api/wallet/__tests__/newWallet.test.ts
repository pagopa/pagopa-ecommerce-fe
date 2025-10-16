import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { ecommerceIOPostWallet } from "../newWallet";
import { getSessionItem, SessionItems } from "../../../storage/sessionStorage";
import { ecommerceIOClientV1 } from "../../../api/client";

// Mock dependencies
jest.mock("../../../storage/sessionStorage", () => ({
  getSessionItem: jest.fn(),
  SessionItems: {
    paymentMethodId: "paymentMethodId",
    amount: "amount",
  },
}));

jest.mock("../../../api/client", () => ({
  ecommerceIOClientV1: {
    createWalletForTransactionsForIO: jest.fn(),
  },
}));

describe("ecommerceIOPostWallet", () => {
  const mockToken = "mock-token";
  const mockTransactionId = "mock-transaction-id";
  const mockPaymentMethodId = "mock-payment-method";
  const mockAmount = 1000;

  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionItem as jest.Mock).mockImplementation((key) => {
      if (key === SessionItems.paymentMethodId) {
        return mockPaymentMethodId;
      }
      if (key === SessionItems.amount) {
        return mockAmount;
      }
      return null;
    });
  });

  it("returns Some(response) when wallet creation succeeds with status 201", async () => {
    const mockResponse = { status: 201, value: { walletId: "abc123" } };

    (
      ecommerceIOClientV1.createWalletForTransactionsForIO as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostWallet(mockToken, mockTransactionId);

    expect(result).toEqual(O.some(mockResponse.value));
  });

  it("returns None when wallet creation response status is not 201", async () => {
    const mockResponse = { status: 400, value: {} };

    (
      ecommerceIOClientV1.createWalletForTransactionsForIO as jest.Mock
    ).mockResolvedValue(E.right(mockResponse));

    const result = await ecommerceIOPostWallet(mockToken, mockTransactionId);

    expect(result).toEqual(O.none);
  });

  it("returns None when the client throws an error", async () => {
    (
      ecommerceIOClientV1.createWalletForTransactionsForIO as jest.Mock
    ).mockRejectedValue(new Error("Network error"));

    const result = await ecommerceIOPostWallet(mockToken, mockTransactionId);

    expect(result).toEqual(O.none);
  });

  it("returns None when session items are missing", async () => {
    (getSessionItem as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const result = await ecommerceIOPostWallet(mockToken, mockTransactionId);

    expect(result).toEqual(O.none);
  });
});
