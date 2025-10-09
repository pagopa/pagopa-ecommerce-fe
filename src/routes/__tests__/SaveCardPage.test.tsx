import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
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
  }),
}));

describe("SaveCardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  /*
  #TODO
  it("calls save and no-save handlers on button click", () => {
    const saveButton = screen.getByText("saveCardPage.saveTitle").closest("button")!;
    const noSaveButton = screen.getByText("saveCardPage.noSaveTitle").closest("button")!;

    fireEvent.click(saveButton);
    fireEvent.click(noSaveButton);

    expect(true).toBe(true);
  }); */
});
