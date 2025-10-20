import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import {
  ecommerceIOGetTransactionOutcomeInfo,
  ecommerceCHECKOUTGetTransactionOutcomeInfo,
} from "../getTransactionInfo";
import {
  ecommerceIOClientWithFinalStatusDecoderPollingV1,
  ecommerceCHECKOUTClientWithFinalStatusDecoderPollingV1,
} from "../../client";

jest.mock("../../client", () => ({
  ecommerceIOClientWithFinalStatusDecoderPollingV1: {
    getTransactionOutcomes: jest.fn(),
  },
  ecommerceCHECKOUTClientWithFinalStatusDecoderPollingV1: {
    getTransactionOutcomes: jest.fn(),
  },
}));

describe("ecommerceIOGetTransactionInfo", () => {
  const mockResponse = { id: "tx123", amount: 100 }; // shape matches IOTransactionInfo

  it("returns Some(value) when client returns Right with status 200", async () => {
    (
      ecommerceIOClientWithFinalStatusDecoderPollingV1.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 200, value: mockResponse }));
    const result = await ecommerceIOGetTransactionOutcomeInfo("tx123", "token");
    expect(result).toEqual(O.some(mockResponse));
  });

  it("returns None when client returns Right with non-200 status", async () => {
    (
      ecommerceIOClientWithFinalStatusDecoderPollingV1.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 404, value: mockResponse }));
    const result = await ecommerceIOGetTransactionOutcomeInfo("tx123", "token");
    expect(result).toEqual(O.none);
  });

  it("returns None when client throws an error", async () => {
    (
      ecommerceIOClientWithFinalStatusDecoderPollingV1.getTransactionOutcomes as jest.Mock
    ).mockRejectedValue(new Error("network error"));
    const result = await ecommerceIOGetTransactionOutcomeInfo("tx123", "token");
    expect(result).toEqual(O.none);
  });
});

describe("ecommerceCHECKOUTGetTransaction", () => {
  const mockResponse = { transactionId: "tx456", status: "COMPLETED" }; // shape matches CHECKOUTTransactionInfo

  it("returns Some(value) when client returns Right with status 200", async () => {
    (
      ecommerceCHECKOUTClientWithFinalStatusDecoderPollingV1.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 200, value: mockResponse }));
    const result = await ecommerceCHECKOUTGetTransactionOutcomeInfo(
      "tx456",
      "token"
    );
    expect(result).toEqual(O.some(mockResponse));
  });

  it("returns None when client returns Right with non-200 status", async () => {
    (
      ecommerceCHECKOUTClientWithFinalStatusDecoderPollingV1.getTransactionOutcomes as jest.Mock
    ).mockResolvedValue(E.right({ status: 500, value: mockResponse }));
    const result = await ecommerceCHECKOUTGetTransactionOutcomeInfo(
      "tx456",
      "token"
    );
    expect(result).toEqual(O.none);
  });

  it("returns None when client throws an error", async () => {
    (
      ecommerceCHECKOUTClientWithFinalStatusDecoderPollingV1.getTransactionOutcomes as jest.Mock
    ).mockRejectedValue(new Error("timeout"));
    const result = await ecommerceCHECKOUTGetTransactionOutcomeInfo(
      "tx456",
      "token"
    );
    expect(result).toEqual(O.none);
  });
});
