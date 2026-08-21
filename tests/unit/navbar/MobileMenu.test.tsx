import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@build-me/ui/navbar";

describe("MobileMenu", () => {
  it("starts closed: panel not rendered, button says 'Open menu'", () => {
    render(
      <MobileMenu>
        <a href="/">Home</a>
      </MobileMenu>,
    );

    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });

  it("opens the panel on click, revealing children", async () => {
    const user = userEvent.setup();
    render(
      <MobileMenu>
        <a href="/">Home</a>
      </MobileMenu>,
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();
  });

  it("closes again on second click", async () => {
    const user = userEvent.setup();
    render(
      <MobileMenu>
        <a href="/">Home</a>
      </MobileMenu>,
    );

    const button = screen.getByRole("button");
    await user.click(button); // open
    await user.click(button); // close

    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });

  it("sets aria-expanded correctly in both states", async () => {
    const user = userEvent.setup();
    render(
      <MobileMenu>
        <a href="/">Home</a>
      </MobileMenu>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
