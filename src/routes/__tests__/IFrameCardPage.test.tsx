import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, act, fireEvent, screen, waitFor } from "@testing-library/react";
import IFrameCardPage from "../../routes/IframeCardPage";

// Spy navigate
const navigate = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => navigate,
}));

jest.mock(
  "../../features/payment/components/IframeCardForm/IframeCardForm",
  () => ({
    __esModule: true,
    default: ({ onCancel }: { onCancel: () => void }) => (
      <button onClick={onCancel}>
        {"paymentNoticePage.formButtons.cancel"}
      </button>
    ),
  })
);

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({
    i18nKey,
  }: {
    i18nKey?: string;
    values?: Record<string, any>;
    components?: Array<any>;
    children?: React.ReactNode;
  }) => <span data-testid="mocked-trans">{i18nKey || "no-key"}</span>,
}));

describe("IFrameCardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("test back button", async () => {
    render(
      <MemoryRouter>
        <IFrameCardPage />
      </MemoryRouter>
    );

    await act(async () => {
      const back = screen.getByText("paymentNoticePage.formButtons.cancel");
      fireEvent.click(back);
    });

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  test("help link should be visible", () => {
    render(
      <MemoryRouter>
        <IFrameCardPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("helpLink")).toBeInTheDocument();
  });

  test("when help link is clicked modal is visible", () => {
    render(
      <MemoryRouter>
        <IFrameCardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("helpLink"));
    expect(screen.getByTestId("modalTitle")).toBeInTheDocument();
  });
  test("when close button is clicked modal closes", async () => {
    render(
      <MemoryRouter>
        <IFrameCardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("helpLink"));
    fireEvent.click(screen.getByTestId("closeButton"));

    await waitFor(() =>
      expect(screen.queryByTestId("modalTitle")).not.toBeInTheDocument()
    );
  });
});
