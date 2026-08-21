import { describe, it, expect, vi } from "vitest";
import type { MouseEvent as ReactMouseEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrandLogo } from "@build-me/ui/navbar";
import type { RouterLinkProps } from "@build-me/ui/navbar";

function StubLink({
  to,
  children,
  className,
  "aria-label": ariaLabel,
  onClick,
}: RouterLinkProps) {
  return (
    <a href={to} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  );
}

describe("BrandLogo", () => {
  it("renders the mark, wordmark, and tagline lines", () => {
    render(
      <BrandLogo
        as={StubLink}
        href="/"
        ariaLabel="Home"
        mark={<span data-testid="mark">M</span>}
        wordmark={<span data-testid="wordmark">Brand</span>}
        taglineLines={[
          <span key="a">Line A</span>,
          <span key="b">Line B</span>,
        ]}
      />,
    );

    expect(screen.getByTestId("mark")).toBeInTheDocument();
    expect(screen.getByTestId("wordmark")).toBeInTheDocument();
    expect(screen.getByText("Line A")).toBeInTheDocument();
    expect(screen.getByText("Line B")).toBeInTheDocument();
  });

  it("uses the injected link component with the correct href and accessible name", () => {
    render(
      <BrandLogo
        as={StubLink}
        href="/"
        ariaLabel="Home"
        mark={<span>M</span>}
      />,
    );

    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("calls onLogoClick when clicked", async () => {
    const user = userEvent.setup();
    const onLogoClick = vi.fn();

    render(
      <BrandLogo
        as={StubLink}
        href="/"
        ariaLabel="Home"
        mark={<span>M</span>}
        onLogoClick={onLogoClick}
      />,
    );

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onLogoClick).toHaveBeenCalledTimes(1);
  });

  it("lets the consumer preventDefault via onLogoClick (AC-06 guard)", async () => {
    const user = userEvent.setup();
    const onLogoClick = vi.fn((event: ReactMouseEvent) => {
      event.preventDefault();
    });

    render(
      <BrandLogo
        as={StubLink}
        href="/"
        ariaLabel="Home"
        mark={<span>M</span>}
        onLogoClick={onLogoClick}
      />,
    );

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onLogoClick).toHaveBeenCalled();
    const event = onLogoClick.mock.calls[0][0] as ReactMouseEvent;
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not render a tagline wrapper when taglineLines is empty/omitted", () => {
    const { container } = render(
      <BrandLogo
        as={StubLink}
        href="/"
        ariaLabel="Home"
        mark={<span>M</span>}
      />,
    );
    expect(container.querySelector(".flex-col")).not.toBeInTheDocument();
  });
});
