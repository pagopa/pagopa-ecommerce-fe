/* eslint-disable functional/immutable-data */
/* eslint-disable sonarjs/no-identical-functions */
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import * as O from "fp-ts/Option";
import IframeCardForm from "../IframeCardForm";
import { IdFields } from "../../../../../models/npgModel";
import { npgSessionsFields } from "../../../../../utils/api/methods/paymentMethodHelper";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
  }),
}));

// MOCK: MUI <Box> per evitare warning su props Style/SX
jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("../../../../../components/FormButtons/FormButtons", () => ({
  FormButtons: ({
    handleSubmit,
    handleCancel,
    disabledSubmit,
    loadingSubmit,
  }: any) => (
    <div data-testid="form-buttons">
      <button
        data-testid="submit-button"
        onClick={handleSubmit}
        disabled={disabledSubmit}
        data-loading={loadingSubmit}
      >
        Submit
      </button>
      <button data-testid="cancel-button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  ),
}));

jest.mock(
  "../../../../../features/payment/components/IframeCardForm/IframeCardField",
  () => ({
    IframeCardField: ({
      id,
      isAllFieldsLoaded,
      activeField,
      isValid,
      errorMessage,
    }: any) => (
      <div
        data-testid={`iframe-field-${id}`}
        data-loaded={isAllFieldsLoaded}
        data-active={activeField === id}
        data-valid={String(isValid)}
      >
        {errorMessage}
      </div>
    ),
  })
);

jest.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: React.forwardRef((_props, ref) => {
    React.useImperativeHandle(ref, () => ({
      reset: jest.fn(),
      execute: jest.fn(),
      executeAsync: jest.fn().mockResolvedValue("recaptcha-token"),
    }));
    return <div data-testid="recaptcha" />;
  }),
}));

jest.mock("../../../../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH: "/done",
  }),
}));

const memoryStore: Record<string, string> = {};
jest.mock("../../../../../utils/storage/sessionStorage", () => {
  const SessionItems = {
    orderId: "orderId",
    correlationId: "correlationId",
  };
  return {
    SessionItems,
    getSessionItem: (k: string) => memoryStore[k],
    // eslint-disable-next-line functional/immutable-data
    setSessionItem: (k: string, v: string) => (memoryStore[k] = v),
  };
});

const clearNavigationEvents = jest.fn();
jest.mock("../../../../../utils/eventListeners", () => ({
  clearNavigationEvents: jest.fn(() => clearNavigationEvents()),
}));

jest.mock("../../../../../utils/api/methods/paymentMethodHelper", () => ({
  npgSessionsFields: jest.fn(),
}));

// eslint-disable-next-line functional/no-let
let capturedCfg: any = {};
const buildSdkMock = jest.fn(() => ({
  confirmData: jest.fn((cb?: () => void) => {
    if (cb) {
      cb();
    } // setLoading(true)
    if (capturedCfg.onReadyForPayment) {
      capturedCfg.onReadyForPayment();
    }
  }),
}));

jest.mock("../../../../../hooks/useNpgSdk", () => ({
  useNpgSdk: (cfg: any) => {
    capturedCfg = cfg;
    setTimeout(() => cfg.onAllFieldsLoaded && cfg.onAllFieldsLoaded(), 0);
    return { sdkReady: true, buildSdk: buildSdkMock };
  },
}));

const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originalLocation, replace: jest.fn() },
  });
});
afterAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
});

const fullSession = {
  orderId: "order123",
  correlationId: "corr123",
  paymentMethodData: {
    paymentMethod: "CARDS",
    form: [
      { id: "CARD_NUMBER" },
      { id: "EXPIRATION_DATE" },
      { id: "SECURITY_CODE" },
      { id: "CARDHOLDER_NAME" },
    ],
  },
};
const simpleSession = {
  orderId: "order123",
  correlationId: "corr123",
  paymentMethodData: {
    paymentMethod: "CARDS",
    form: [{ id: "CARD_NUMBER" }],
  },
};

describe("IframeCardForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line functional/immutable-data
    Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
  });

  it("renders the fields and the buttons after npgSessionsFields = Some", async () => {
    (npgSessionsFields as jest.Mock).mockResolvedValue(O.some(fullSession));

    render(<IframeCardForm />);

    await waitFor(() => {
      expect(
        screen.getByTestId("iframe-field-CARD_NUMBER")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("iframe-field-EXPIRATION_DATE")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("iframe-field-SECURITY_CODE")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("iframe-field-CARDHOLDER_NAME")
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("form-buttons")).toBeInTheDocument();
  });

  it("sets orderId/correlationId in session and on submit redirects outcome=0", async () => {
    (npgSessionsFields as jest.Mock).mockResolvedValue(O.some(simpleSession));

    render(<IframeCardForm />);

    await waitFor(() => {
      expect(
        screen.getByTestId("iframe-field-CARD_NUMBER")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("iframe-field-CARD_NUMBER")).toHaveAttribute(
        "data-loaded",
        "true"
      );
    });

    act(() => {
      Object.values(IdFields).forEach((id) => {
        capturedCfg.onChange(id, {
          isValid: true,
          errorCode: null,
          errorMessage: null,
        });
      });
    });

    // Submit
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(clearNavigationEvents).toHaveBeenCalled();
      expect(window.location.replace).toHaveBeenCalledWith(
        `/done?outcome=0&orderId=${simpleSession.orderId}&correlationId=${simpleSession.correlationId}`
      );
    });
  });

  it("if npgSessionsFields = None ⇒ onError ⇒ redirect outcome=1", async () => {
    (npgSessionsFields as jest.Mock).mockResolvedValue(O.none);

    render(<IframeCardForm />);

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/done?outcome=1");
    });
  });

  it("onPaymentRedirect of the SDK leads to an error and redirects with outcome=1", async () => {
    (npgSessionsFields as jest.Mock).mockResolvedValue(O.some(simpleSession));

    render(<IframeCardForm />);

    await waitFor(() => {
      expect(
        screen.getByTestId("iframe-field-CARD_NUMBER")
      ).toBeInTheDocument();
    });

    act(() => {
      capturedCfg.onPaymentRedirect("https://example.com/redirect");
    });

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/done?outcome=1");
    });
  });

  it("if buildSdk throws an error ⇒ onBuildError ⇒ onError ⇒ redirect outcome=1", async () => {
    (npgSessionsFields as jest.Mock).mockResolvedValue(O.some(simpleSession));

    (buildSdkMock as jest.Mock).mockImplementationOnce(() => {
      throw new Error("build failed");
    });

    render(<IframeCardForm />);

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/done?outcome=1");
    });
  });
});
