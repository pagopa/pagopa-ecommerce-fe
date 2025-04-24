/* eslint-disable 
    @typescript-eslint/no-var-requires,
    @typescript-eslint/no-empty-function,
    @typescript-eslint/no-unused-expressions
*/

import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as O from "fp-ts/Option";

// stub react-i18next for the embedded <CheckoutLoader />
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// 1) stub config so no window._env_ access
jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: 100,
  }),
}));

// 2) stub react-router
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

// 3) stub URL utils
const mockGetFragments = jest.fn();
const mockRedirect = jest.fn();
jest.mock("../../utils/urlUtilities", () => ({
  getFragments: mockGetFragments,
  redirectToClient: mockRedirect,
}));

// 4) stub sessionStorage
jest.mock("../../utils/storage/sessionStorage", () => ({
  SessionItems: { sessionToken: "sessionToken" },
  getSessionItem: jest.fn(),
}));

// 5) stub the two back-end calls
const mockIOGet = jest.fn();
const mockCheckoutGet = jest.fn();
jest.mock("../../utils/api/transactions/getTransactionInfo", () => ({
  ecommerceIOGetTransactionInfo: mockIOGet,
  ecommerceCHECKOUTGetTransaction: mockCheckoutGet,
}));

// 6) stub the outcome mapper (numeric enum!)
const mockOutcome = jest.fn();
jest.mock("../../utils/api/transactions/TransactionResultUtil", () => ({
  getOnboardingPaymentOutcome: mockOutcome,
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

    await act(async () => {}); // let the effect run

    expect(mockIOGet).toHaveBeenCalledWith("tx1", "tok1");
    expect(mockRedirect).toHaveBeenCalledWith({
      clientId: "IO",
      transactionId: "tx1",
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
    });
  });

  it("on SUCCESS shows continue button only after the delay", async () => {
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

    +(
      // button should _not_ yet exist in the DOM
      (+expect(document.getElementById("continueToIOBtn")).toBeNull())
    );

    // after the 100ms fake timer...
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // now our button (with that id) has been rendered
    +expect(document.getElementById("continueToIOBtn")).toBeInTheDocument();

    jest.useRealTimers();
  });
});
