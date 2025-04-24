/* eslint-disable 
    @typescript-eslint/no-var-requires
*/

import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// stub react-i18next so useTranslation() never warns
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// 1) stub config so no window._env_ access
jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_GDI_CHECK_TIMEOUT: 100,
  }),
}));

// 2) stub react-router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// 3) stub URL utils
const mockGetFragments = jest.fn().mockReturnValue({
  sessionToken: "tok123",
  clientId: "IO",
  transactionId: "tx123",
});
const mockGetBase64Fragment = jest.fn().mockReturnValue("https://iframe.url");
jest.mock("../../utils/urlUtilities", () => ({
  getFragments: mockGetFragments,
  getBase64Fragment: mockGetBase64Fragment,
  redirectToClient: jest.fn(),
}));

// 4) stub sessionStorage
const mockSetSessionItem = jest.fn();
jest.mock("../../utils/storage/sessionStorage", () => ({
  SessionItems: { sessionToken: "sessionToken" },
  setSessionItem: mockSetSessionItem,
}));

// 5) stub your SDK hook
const buildSdk = jest.fn();
jest.mock("../../hooks/useNpgSdk", () => ({
  useNpgSdk: () => ({
    buildSdk,
    sdkReady: false,
  }),
}));

import GdiCheckPage from "../GdiCheckPage";
import {
  EcommerceRoutes,
  ROUTE_FRAGMENT,
} from "../../routes/models/routeModel";

describe("GdiCheckPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does nothing until sdkReady flips true, then stores token + calls buildSdk", () => {
    const { rerender } = render(<GdiCheckPage />);
    expect(buildSdk).not.toHaveBeenCalled();
    expect(mockSetSessionItem).not.toHaveBeenCalled();

    jest
      .spyOn(require("../../hooks/useNpgSdk"), "useNpgSdk")
      .mockReturnValue({ buildSdk, sdkReady: true });

    act(() => {
      rerender(<GdiCheckPage />);
    });

    expect(mockSetSessionItem).toHaveBeenCalledWith("sessionToken", "tok123");
    expect(buildSdk).toHaveBeenCalled();
  });

  it("renders exactly one iframe with the decoded URL", () => {
    jest
      .spyOn(require("../../hooks/useNpgSdk"), "useNpgSdk")
      .mockReturnValue({ buildSdk, sdkReady: true });

    const { container } = render(<GdiCheckPage />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://iframe.url");
  });

  it("navigates to the correct route after the configured timeout", () => {
    jest.useFakeTimers();
    jest
      .spyOn(require("../../hooks/useNpgSdk"), "useNpgSdk")
      .mockReturnValue({ buildSdk, sdkReady: true });

    render(<GdiCheckPage />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const expectedPath = `/${EcommerceRoutes.ROOT}/${EcommerceRoutes.ESITO}#${ROUTE_FRAGMENT.CLIENT_ID}=IO&${ROUTE_FRAGMENT.TRANSACTION_ID}=tx123`;
    expect(mockNavigate).toHaveBeenCalledWith(expectedPath, { replace: true });

    jest.useRealTimers();
  });
});
