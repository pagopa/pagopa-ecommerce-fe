import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import {
  ecommerceIOGetTransactionOutcomeInfo,
  ecommerceCHECKOUTGetTransactionOutcomeInfo,
} from "../getTransactionInfo";
import {
  ecommerceIOClientWithPollingV2,
  ecommerceCHECKOUTClientClientWithPolling,
} from "../../client";

jest.mock("../../client", () => ({
  ecommerceIOClientWithPollingV2: {
    getTransactionOutcomes: jest.fn(),
  },
  ecommerceCHECKOUTClientClientWithPolling: {
    getTransactionOutcomes: jest.fn(),
  },
}));

describe("ecommerceIOGetTransactionInfo", () => {
  const mockResponse = { id: "tx123", amount: 100 }; // shape matches IOTransactionInfo

  it("returns Some(value) when client returns Right with status 200", async () => {
    (
      ecommerceIOClientWithPollingV2.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 200, value: mockResponse }));
    const result = await ecommerceIOGetTransactionOutcomeInfo("tx123", "token");
    expect(result).toEqual(O.some(mockResponse));
  });

  it("returns None when client returns Right with non-200 status", async () => {
    (
      ecommerceIOClientWithPollingV2.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 404, value: mockResponse }));
    const result = await ecommerceIOGetTransactionOutcomeInfo("tx123", "token");
    expect(result).toEqual(O.none);
  });

  it("returns None when client throws an error", async () => {
    (
      ecommerceIOClientWithPollingV2.getTransactionOutcomes as jest.Mock
    ).mockRejectedValue(new Error("network error"));
    const result = await ecommerceIOGetTransactionOutcomeInfo("tx123", "token");
    expect(result).toEqual(O.none);
  });
});

describe("ecommerceCHECKOUTGetTransaction", () => {
  const mockResponse = { transactionId: "tx456", status: "COMPLETED" }; // shape matches CHECKOUTTransactionInfo

  it("returns Some(value) when client returns Right with status 200", async () => {
    (
      ecommerceCHECKOUTClientClientWithPolling.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 200, value: mockResponse }));
    const result = await ecommerceCHECKOUTGetTransactionOutcomeInfo(
      "tx456",
      "token"
    );
    expect(result).toEqual(O.some(mockResponse));
  });

  it("returns None when client returns Right with non-200 status", async () => {
    (
      ecommerceCHECKOUTClientClientWithPolling.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 500, value: mockResponse }));
    const result = await ecommerceCHECKOUTGetTransactionOutcomeInfo(
      "tx456",
      "token"
    );
    expect(result).toEqual(O.none);
  });

  it("returns None when client throws an error", async () => {
    (
      ecommerceCHECKOUTClientClientWithPolling.getTransactionOutcomes as jest.Mock
    ).mockRejectedValue(new Error("timeout"));
    const result = await ecommerceCHECKOUTGetTransactionOutcomeInfo(
      "tx456",
      "token"
    );
    expect(result).toEqual(O.none);
  });
});
