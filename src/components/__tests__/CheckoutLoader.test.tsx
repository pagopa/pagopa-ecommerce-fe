import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import CheckoutLoader from "../CheckoutLoader";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: jest.fn(),
    useTheme: jest.fn(),
  };
});

describe("CheckoutLoader", () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      breakpoints: { down: (_: string) => "" },
    });
  });

  it("applies mobile-specific styles when useMediaQuery returns true", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    render(<CheckoutLoader />);
    const container = screen.getByLabelText("ariaLabels.loading");
    expect(container).toHaveStyle({
      top: "80px",
      position: "fixed",
      width: "100vw",
      height: "calc(100vh - 80px)",
    });
  });

  it("applies desktop-specific styles when useMediaQuery returns false", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    render(<CheckoutLoader />);
    const container = screen.getByLabelText("ariaLabels.loading");
    expect(container).toHaveStyle({
      top: "100px",
      position: "fixed",
      width: "100vw",
      height: "80vh",
    });
  });

  it("renders a CircularProgress", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    render(<CheckoutLoader />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
