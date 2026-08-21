import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "../../apps/web/src/components/Navbar/Navbar";

vi.mock("@build-me/ui/navbar", async () => {
  const actual = await vi.importActual<typeof import("@build-me/ui/navbar")>(
    "@build-me/ui/navbar",
  );
  return {
    ...actual,
    trackNavigationEvent: vi.fn(),
    configureNavAnalytics: vi.fn(),
  };
});

import { trackNavigationEvent } from "@build-me/ui/navbar";

function renderAtRoute(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>Home Page</main>
            </>
          }
        />
        <Route
          path="/test"
          element={
            <>
              <Navbar />
              <main>Test Page</main>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

function getLogoLink(): HTMLElement {
  const candidates = screen.getAllByRole("link", { name: "Home" });
  const logo = candidates.find(
    (el) => el.getAttribute("aria-label") === "Home",
  );
  if (!logo) throw new Error("Logo link with aria-label='Home' not found");
  return logo;
}

function getNavHomeLink(): HTMLElement {
  const candidates = screen.getAllByRole("link", { name: "Home" });
  const navLink = candidates.find(
    (el) => el.getAttribute("aria-label") !== "Home",
  );
  if (!navLink) throw new Error("Nav 'Home' link (visible text) not found");
  return navLink;
}

describe("Navbar integration (real router)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both the logo link and the Home nav link", () => {
    renderAtRoute("/");

    expect(getLogoLink()).toBeInTheDocument();
    expect(getNavHomeLink()).toBeInTheDocument();
  });

  it("fires a logo_view analytics event on mount", () => {
    renderAtRoute("/");
    expect(trackNavigationEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: "logo_view", sourceRoute: "/" }),
    );
  });

  it("navigates from a non-Home route back to Home when the logo is clicked", async () => {
    const user = userEvent.setup();
    renderAtRoute("/test");

    expect(screen.getByText("Test Page")).toBeInTheDocument();

    await user.click(getLogoLink());

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("fires a logo_click event with correct source/destination when clicked", async () => {
    const user = userEvent.setup();
    renderAtRoute("/test");

    await user.click(getLogoLink());

    expect(trackNavigationEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "logo_click",
        sourceRoute: "/test",
        destinationRoute: "/",
        navigationSuccess: true,
      }),
    );
  });

  it("AC-06: clicking the logo while already on Home does not throw or break rendering", async () => {
    const user = userEvent.setup();
    renderAtRoute("/");

    await user.click(getLogoLink());

    // Still on Home, nothing broke.
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("navigates when the nav 'Home' link itself is clicked from a non-Home route", async () => {
    const user = userEvent.setup();
    renderAtRoute("/test");

    await user.click(getNavHomeLink());

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
