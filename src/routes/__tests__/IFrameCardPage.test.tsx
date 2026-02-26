import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
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

jest.mock("../../utils/storage/sessionStorage", () => ({
  SessionItems: { sessionToken: "sessionToken" },
  getSessionItem: jest.fn(),
  setSessionItem: jest.fn(),
}));

jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_API_RETRY_NUMBERS_LINEAR: 5,
    ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH: "/done",
    ECOMMERCE_IO_SAVE_CARD_FAIL_REDIRECT_PATH: "/fail",
  }),
}));

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
