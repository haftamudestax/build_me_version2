import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  return screen.getByRole("link", { name: "Home" });
}

describe("Navbar integration (real router)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("location", { ...window.location, href: "" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the logo link and no separate Home nav link (removed per feedback)", () => {
    renderAtRoute("/");

    expect(getLogoLink()).toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(1);
  });

  it("fires a logo_view analytics event on mount", () => {
    renderAtRoute("/");
    expect(trackNavigationEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: "logo_view", sourceRoute: "/" }),
    );
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

  it("sets window.location.href to '/' on a plain left click (full page reload, not SPA nav)", async () => {
    const user = userEvent.setup();
    renderAtRoute("/test");

    await user.click(getLogoLink());

    expect(window.location.href).toBe("/");
  });

  it("does not throw when clicking the logo while already on Home", async () => {
    const user = userEvent.setup();
    renderAtRoute("/");

    await user.click(getLogoLink());

    expect(window.location.href).toBe("/");
  });
});
