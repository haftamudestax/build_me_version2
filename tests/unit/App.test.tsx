import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "@about-me/web/App";

vi.mock("@about-me/web/config/featureFlags", () => ({
  featureFlags: {
    heroSection: true,
  },
}));

describe("App", () => {
  it("renders HeroSection when heroSection feature flag is enabled", () => {
    render(<App />);

    expect(screen.getByText("Technology Ownership")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Build Better Digital Experiences/i,
      }),
    ).toBeInTheDocument();
  });
});
