import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as O from "fp-ts/Option";
import SaveCardPage from "../SaveCardPage";
import { EcommerceRoutes } from "../models/routeModel";

// Mock useTranslation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: any) => <span>{children}</span>,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock InformationModal to control openDialog/closeDialog
const mockOpenDialog = jest.fn();
const mockCloseDialog = jest.fn();

jest.mock("../../components/InformationModal", () =>
  React.forwardRef((props: { children: React.ReactNode }, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      openDialog: mockOpenDialog,
      closeDialog: mockCloseDialog,
    }));
    return <div data-testid="information-modal">{props.children}</div>;
  })
);

jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_API_RETRY_NUMBERS_LINEAR: 5,
    ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH: "/done",
  }),
}));

jest.mock("../../utils/api/transactions/newTransaction", () => ({
  __esModule: true,
  ecommerceIOPostTransaction: jest.fn(),
}));

jest.mock("../../utils/api/wallet/newWallet", () => ({
  __esModule: true,
  ecommerceIOPostWallet: jest.fn(),
}));

import { ecommerceIOPostTransaction } from "../../utils/api/transactions/newTransaction";
import { ecommerceIOPostWallet } from "../../utils/api/wallet/newWallet";
import { RptId } from "../../../generated/definitions/payment-ecommerce-webview-v1/RptId";
import { AmountEuroCents } from "../../../generated/definitions/payment-ecommerce-webview-v1/AmountEuroCents";
import { TransactionStatusEnum } from "../../../generated/definitions/payment-ecommerce-webview-v1/TransactionStatus";

const mockIOPostTransaction = ecommerceIOPostTransaction as jest.MockedFunction<
  typeof ecommerceIOPostTransaction
>;
const mockIOPostWallet = ecommerceIOPostWallet as jest.MockedFunction<
  typeof ecommerceIOPostWallet
>;

describe("SaveCardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // eslint-disable-next-line functional/immutable-data
    delete (window as any).location;
    // eslint-disable-next-line functional/immutable-data
    (window as any).location = { replace: jest.fn() };

    render(<SaveCardPage />);
  });

  it("renders page title and description", () => {
    expect(screen.getByText("saveCardPage.title")).toBeInTheDocument();
    expect(screen.getByText("saveCardPage.description")).toBeInTheDocument();
  });

  it("renders save and no-save buttons", () => {
    expect(screen.getByText("saveCardPage.saveTitle")).toBeInTheDocument();
    expect(screen.getByText("saveCardPage.noSaveTitle")).toBeInTheDocument();
  });

  it("calls openDialog when more info button is clicked", () => {
    const moreInfoButton = screen.getByTestId("moreInfo");
    fireEvent.click(moreInfoButton);
    expect(mockOpenDialog).toHaveBeenCalled();
  });

  it("calls closeDialog when modal close button is clicked", () => {
    const closeButton = screen.getByTestId("closeButton");
    fireEvent.click(closeButton);
    expect(mockCloseDialog).toHaveBeenCalled();
  });

  it("renders modal content correctly", () => {
    expect(screen.getByTestId("modalTitle")).toHaveTextContent(
      "saveCardPage.moreInfo"
    );
    expect(screen.getByText(/Default text/)).toBeInTheDocument();
  });

  it("navigates to the insert cart route when the noSaveRedirectBtn button is clicked", () => {
    const noSaveRedirectBtn = screen.getByTestId("noSaveRedirectBtn");
    fireEvent.click(noSaveRedirectBtn);
    const redirectPath = `/${EcommerceRoutes.ROOT}/${EcommerceRoutes.NOT_ONBOARDED_CARD_PAYMENT}`;
    expect(mockNavigate).toHaveBeenCalledWith(redirectPath);
  });

  it("redirects to outcome path if transaction fails (None)", async () => {
    mockIOPostTransaction.mockResolvedValue(O.none);

    const saveButton = screen
      .getByText("saveCardPage.saveTitle")
      .closest("button")!;
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(window.location.replace).toHaveBeenCalledWith("/done?outcome=1")
    );
    expect(mockIOPostWallet).not.toHaveBeenCalled();
  });

  it("redirects to wallet URL if transaction succeeds and wallet returns Some({redirectUrl})", async () => {
    mockIOPostTransaction.mockResolvedValue(
      O.some({
        transactionId: "577725a90dfe4b89b434b16ccad69247",
        payments: [
          {
            rptId: "77777777777302012387654312384" as RptId,
            amount: 600 as AmountEuroCents,
          },
        ],
        status: TransactionStatusEnum.ACTIVATED,
      })
    );
    mockIOPostWallet.mockResolvedValue(
      O.some({
        walletId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        redirectUrl: "https://example.com/next",
      })
    );

    const saveButton = screen
      .getByText("saveCardPage.saveTitle")
      .closest("button")!;
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(window.location.replace).toHaveBeenCalledWith(
        "https://example.com/next"
      )
    );
  });

  it("redirects to outcome path if wallet returns None", async () => {
    mockIOPostTransaction.mockResolvedValue(
      O.some({
        transactionId: "577725a90dfe4b89b434b16ccad69247",
        payments: [
          {
            rptId: "77777777777302012387654312384" as RptId,
            amount: 600 as AmountEuroCents,
          },
        ],
        status: TransactionStatusEnum.ACTIVATED,
      })
    );
    mockIOPostWallet.mockResolvedValue(O.none);

    const saveButton = screen
      .getByText("saveCardPage.saveTitle")
      .closest("button")!;
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(window.location.replace).toHaveBeenCalledWith("/done?outcome=1")
    );
  });

  it("redirects to outcome path if wallet returns Some(undefined)", async () => {
    mockIOPostTransaction.mockResolvedValue(
      O.some({
        transactionId: "577725a90dfe4b89b434b16ccad69247",
        payments: [
          {
            rptId: "77777777777302012387654312384" as RptId,
            amount: 600 as AmountEuroCents,
          },
        ],
        status: TransactionStatusEnum.ACTIVATED,
      })
    );
    mockIOPostWallet.mockResolvedValue(
      O.some({
        walletId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        redirectUrl: undefined,
      })
    );

    const saveButton = screen
      .getByText("saveCardPage.saveTitle")
      .closest("button")!;
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(window.location.replace).toHaveBeenCalledWith("/done?outcome=1")
    );
  });
});
