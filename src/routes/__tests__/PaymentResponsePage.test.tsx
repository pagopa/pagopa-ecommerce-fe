/* eslint-disable 
    @typescript-eslint/no-var-requires,
    @typescript-eslint/no-empty-function,
    @typescript-eslint/no-unused-expressions
*/

import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as O from "fp-ts/Option";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: 100,
  }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

const mockGetFragments = jest.fn();
const mockRedirect = jest.fn();
jest.mock("../../utils/urlUtilities", () => ({
  getFragments: mockGetFragments,
  redirectToClient: mockRedirect,
}));

jest.mock("../../utils/storage/sessionStorage", () => ({
  SessionItems: { sessionToken: "sessionToken" },
  getSessionItem: jest.fn(),
}));

const mockIOGet = jest.fn();
const mockCheckoutGet = jest.fn();
jest.mock("../../utils/api/transactions/getTransactionInfo", () => ({
  ecommerceIOGetTransactionOutcomeInfo: mockIOGet,
  ecommerceCHECKOUTGetTransactionOutcomeInfo: mockCheckoutGet,
}));

const mockOutcome = jest.fn();
jest.mock("../../utils/api/transactions/TransactionResultUtil", () => ({
  getOutcome: mockOutcome,
}));

import PaymentResponsePage from "../PaymentResponsePage";
import { ViewOutcomeEnum } from "../../utils/api/transactions/types";

describe("PaymentResponsePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects immediately to GENERIC_ERROR if no fragments", () => {
    mockGetFragments.mockReturnValue({
      clientId: "",
      transactionId: "",
      sessionToken: "",
    });
    (
      require("../../utils/storage/sessionStorage").getSessionItem as jest.Mock
    ).mockReturnValue("X");

    render(<PaymentResponsePage />);
    expect(mockRedirect).toHaveBeenCalledWith({
      clientId: "",
      transactionId: "",
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
    });
  });

  it("calls IO-get + redirects to GENERIC_ERROR when API yields none", async () => {
    mockGetFragments.mockReturnValue({
      clientId: "IO",
      transactionId: "tx1",
      sessionToken: "tok1",
    });
    (
      require("../../utils/storage/sessionStorage").getSessionItem as jest.Mock
    ).mockReturnValue(null);

    mockIOGet.mockResolvedValue(O.none);
    render(<PaymentResponsePage />);

    await act(async () => {});

    expect(mockIOGet).toHaveBeenCalledWith("tx1", "tok1");
    expect(mockRedirect).toHaveBeenCalledWith({
      clientId: "IO",
      transactionId: "tx1",
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
    });
  });

  it("on SUCCESS shows continue button only after the delay (IO)", async () => {
    jest.useFakeTimers();

    mockGetFragments.mockReturnValue({
      clientId: "IO",
      transactionId: "tx42",
      sessionToken: "",
    });
    (
      require("../../utils/storage/sessionStorage").getSessionItem as jest.Mock
    ).mockReturnValue("tok42");

    mockIOGet.mockResolvedValue(
      O.some({ status: "NOTIFIED_OK", gatewayInfo: {}, nodeInfo: {} })
    );
    mockOutcome.mockReturnValue(ViewOutcomeEnum.SUCCESS);

    render(<PaymentResponsePage />);
    await act(async () => {});

    expect(document.getElementById("continueToIOBtn")).toBeNull();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(document.getElementById("continueToIOBtn")).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("calls CHECKOUT-get + redirects to GENERIC_ERROR when API yields none (CHECKOUT)", async () => {
    mockGetFragments.mockReturnValue({
      clientId: "CHECKOUT",
      transactionId: "txC1",
      sessionToken: "ftok",
    });
    (
      require("../../utils/storage/sessionStorage").getSessionItem as jest.Mock
    ).mockReturnValue(null);

    mockCheckoutGet.mockResolvedValue(O.none);
    render(<PaymentResponsePage />);

    await act(async () => {});

    expect(mockCheckoutGet).toHaveBeenCalledWith("txC1", "ftok");
    expect(mockRedirect).toHaveBeenCalledWith({
      clientId: "CHECKOUT",
      transactionId: "txC1",
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
    });
  });

  it("calls CHECKOUT-get + redirects to SUCCESS when API yields some (CHECKOUT)", async () => {
    jest.useFakeTimers();

    mockGetFragments.mockReturnValue({
      clientId: "CHECKOUT",
      transactionId: "txC2",
      sessionToken: "ftok2",
    });
    (
      require("../../utils/storage/sessionStorage").getSessionItem as jest.Mock
    ).mockReturnValue(null);

    mockCheckoutGet.mockResolvedValue(
      O.some({ status: "NOTIFIED_OK", gatewayInfo: {}, nodeInfo: {} })
    );
    mockOutcome.mockReturnValue(ViewOutcomeEnum.SUCCESS);

    render(<PaymentResponsePage />);
    await act(async () => {});

    expect(mockCheckoutGet).toHaveBeenCalledWith("txC2", "ftok2");
    expect(mockRedirect).toHaveBeenCalledWith({
      clientId: "CHECKOUT",
      transactionId: "txC2",
      outcome: ViewOutcomeEnum.SUCCESS,
    });
    expect(document.getElementById("continueToIOBtn")).toBeNull();

    jest.useRealTimers();
  });
});
