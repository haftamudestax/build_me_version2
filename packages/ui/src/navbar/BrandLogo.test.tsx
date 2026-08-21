import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrandLogo } from "./BrandLogo";

function MockLink({
  to,
  children,
  ...props
}: {
  to: string;
  children: ReactNode;
  "aria-label"?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}

describe("BrandLogo", () => {
  it("renders the logo mark", () => {
    render(
      <BrandLogo
        as={MockLink}
        href="/"
        ariaLabel="Build Me home"
        mark={<span>Logo Mark</span>}
      />,
    );

    expect(screen.getByText("Logo Mark")).toBeInTheDocument();
  });

  it("renders the optional wordmark", () => {
    render(
      <BrandLogo
        as={MockLink}
        href="/"
        ariaLabel="Build Me home"
        mark={<span>Logo Mark</span>}
        wordmark={<span>Build Me</span>}
      />,
    );

    expect(screen.getByText("Build Me")).toBeInTheDocument();
  });

  it("renders all tagline lines", () => {
    render(
      <BrandLogo
        as={MockLink}
        href="/"
        ariaLabel="Build Me home"
        mark={<span>Logo Mark</span>}
        taglineLines={[
          <span key="line-1">Technology</span>,
          <span key="line-2">Ownership</span>,
        ]}
      />,
    );

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Ownership")).toBeInTheDocument();
  });

  it("renders the correct link and accessible label", () => {
    render(
      <BrandLogo
        as={MockLink}
        href="/about"
        ariaLabel="Go to About Me"
        mark={<span>Logo Mark</span>}
      />,
    );

    const link = screen.getByRole("link", {
      name: "Go to About Me",
    });

    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveAttribute("aria-label", "Go to About Me");
  });

  it("uses the default class when no className is provided", () => {
    render(
      <BrandLogo
        as={MockLink}
        href="/"
        ariaLabel="Build Me home"
        mark={<span>Logo Mark</span>}
      />,
    );

    const link = screen.getByRole("link", {
      name: "Build Me home",
    });

    expect(link).toHaveClass(
      "inline-flex",
      "shrink-0",
      "items-center",
      "gap-3",
      "rounded-md",
    );
  });

  it("uses a custom className when provided", () => {
    render(
      <BrandLogo
        as={MockLink}
        href="/"
        ariaLabel="Build Me home"
        mark={<span>Logo Mark</span>}
        className="custom-logo-class"
      />,
    );

    const link = screen.getByRole("link", {
      name: "Build Me home",
    });

    expect(link).toHaveClass("custom-logo-class");
  });

  it("calls onLogoClick when the logo is clicked", async () => {
    const onLogoClick = vi.fn();

    const { userEvent } = await import("@testing-library/user-event");

    const user = userEvent.setup();

    render(
      <BrandLogo
        as={MockLink}
        href="/"
        ariaLabel="Build Me home"
        mark={<span>Logo Mark</span>}
        onLogoClick={onLogoClick}
      />,
    );

    await user.click(
      screen.getByRole("link", {
        name: "Build Me home",
      }),
    );

    expect(onLogoClick).toHaveBeenCalledTimes(1);
  });
});
