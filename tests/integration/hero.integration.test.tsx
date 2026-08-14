import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "@about-me/web/App";

vi.mock("@about-me/web/config/featureFlags", () => ({
  featureFlags: {
    heroSection: true,
  },
}));

describe("Hero Section Integration", () => {
  it("renders the complete hero experience through App", () => {
    render(<App />);

    expect(screen.getByText("Technology Ownership")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Build Better Digital Experiences/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Simple, fast, and beautiful platforms that win and get real results/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Websties and apps that are easy to use, look great, and work fast/i,
      ),
    ).toBeInTheDocument();
  });
});
