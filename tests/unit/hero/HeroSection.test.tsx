import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "@about-me/web/components/Hero/HeroSection";

describe("HeroSection", () => {
  it("renders the home section", () => {
    render(<HeroSection />);

    const section = document.querySelector("#home");

    expect(section).toBeInTheDocument();
  });

  it("renders the HeroIntro content", () => {
    render(<HeroSection />);

    expect(screen.getByText("Technology Ownership")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Build Better Digital Experiences/i,
      }),
    ).toBeInTheDocument();
  });
});
