import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLinkItem } from "@build-me/ui/navbar";
import type { RouterNavLinkProps } from "@build-me/ui/navbar";

function makeStubNavLink(isActive: boolean) {
  return function StubNavLink({ to, children, className }: RouterNavLinkProps) {
    const resolvedClassName =
      typeof className === "function" ? className({ isActive }) : className;
    return (
      <a href={to} className={resolvedClassName}>
        {children}
      </a>
    );
  };
}

describe("NavLinkItem", () => {
  it("applies active styling when isActive is true", () => {
    render(
      <NavLinkItem as={makeStubNavLink(true)} to="/">
        Home
      </NavLinkItem>,
    );

    const link = screen.getByRole("link", { name: "Home" });
    expect(link.className).toContain("text-white");
  });

  it("applies inactive styling when isActive is false", () => {
    render(
      <NavLinkItem as={makeStubNavLink(false)} to="/about">
        About
      </NavLinkItem>,
    );

    const link = screen.getByRole("link", { name: "About" });
    expect(link.className).toContain("text-blue-200");
  });

  it("supports a custom className function override", () => {
    render(
      <NavLinkItem
        as={makeStubNavLink(true)}
        to="/"
        className={({ isActive }) =>
          isActive ? "custom-active" : "custom-inactive"
        }
      >
        Home
      </NavLinkItem>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveClass(
      "custom-active",
    );
  });
});
