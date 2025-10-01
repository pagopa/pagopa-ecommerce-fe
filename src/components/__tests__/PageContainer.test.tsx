import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageContainer from "../PageContainer";

describe("PageContainer", () => {
  it("renders a title when provided", () => {
    render(<PageContainer title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("does not render a title when not provided", () => {
    render(<PageContainer />);
    const heading = screen.queryByRole("heading", { level: 4 });
    expect(heading).not.toBeInTheDocument();
  });

  it("renders description and link when provided", () => {
    const link = <a href="https://example.com">Example Link</a>;
    render(<PageContainer description="Test Description" link={link} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Example Link")).toBeInTheDocument();
  });

  it("renders children with provided sx style", () => {
    const childrenSx = { backgroundColor: "red" };
    render(
      <PageContainer childrenSx={childrenSx}>
        <div data-testid="child">Child Content</div>
      </PageContainer>
    );
    const childContainer = screen.getByTestId("child").parentElement;
    expect(childContainer).toHaveStyle("background-color: red");
  });
});
