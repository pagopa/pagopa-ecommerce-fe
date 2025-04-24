import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageContainer from "../PageContainer";

describe("PageContainer", () => {
  it("renders children inside nested Boxes and sets aria-live on the outer Box", () => {
    const { container } = render(
      <PageContainer>
        <span data-testid="child">Hello World</span>
      </PageContainer>
    );

    const outer = container.firstElementChild as HTMLElement;
    expect(outer).toHaveAttribute("aria-live", "polite");

    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Hello World");
  });

  it("applies childrenSx styles to the inner Box", () => {
    const paddingValue = "42px";
    const { container } = render(
      <PageContainer childrenSx={{ padding: paddingValue }}>
        <div>Styled</div>
      </PageContainer>
    );

    const outer = container.firstElementChild as HTMLElement;
    const inner = outer.firstElementChild as HTMLElement;
    expect(inner).toHaveStyle({ padding: paddingValue });
    expect(screen.getByText("Styled")).toBeInTheDocument();
  });

  it("works with no children and no childrenSx without errors", () => {
    const { container } = render(<PageContainer />);

    const outer = container.firstElementChild as HTMLElement;
    expect(outer).toHaveAttribute("aria-live", "polite");

    const inner = outer.firstElementChild as HTMLElement;
    expect(inner).toBeEmptyDOMElement();
  });
});
