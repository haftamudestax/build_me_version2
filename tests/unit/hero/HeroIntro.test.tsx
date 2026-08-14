import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroIntro } from "@about-me/web/components/Hero/HeroIntro";

describe("HeroIntro", () => {
  it("renders the technology ownership label", () => {
    render(<HeroIntro />);

    expect(screen.getByText("Technology Ownership")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<HeroIntro />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Build Better Digital Experiences/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    render(<HeroIntro />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Simple, fast, and beautiful platforms that win and get real results/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the paragraph", () => {
    render(<HeroIntro />);

    expect(
      screen.getByText(
        /Websties and apps that are easy to use, look great, and work fast/i,
      ),
    ).toBeInTheDocument();
  });
});
