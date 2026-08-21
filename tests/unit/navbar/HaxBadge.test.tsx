import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HexBadge } from "@build-me/ui/navbar";

describe("HexBadge", () => {
  it("renders an svg with the given colors applied", () => {
    const { container } = render(
      <HexBadge outerColor="red" midColor="green" innerColor="blue">
        <circle data-testid="icon-content" />
      </HexBadge>,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();

    const paths = container.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("fill", "red");
    expect(paths[1]).toHaveAttribute("fill", "green");
    expect(paths[2]).toHaveAttribute("fill", "blue");
  });

  it("renders children inside the clipped group", () => {
    const { getByTestId } = render(
      <HexBadge>
        <circle data-testid="icon-content" />
      </HexBadge>,
    );

    expect(getByTestId("icon-content")).toBeInTheDocument();
  });

  it("renders decorations outside the clip", () => {
    const { getByTestId } = render(
      <HexBadge decorations={<circle data-testid="decoration" />}>
        <rect />
      </HexBadge>,
    );

    expect(getByTestId("decoration")).toBeInTheDocument();
  });

  it("generates a unique clip-path id per instance, so two badges on the same page don't clash", () => {
    const { container } = render(
      <div>
        <HexBadge>
          <rect />
        </HexBadge>
        <HexBadge>
          <rect />
        </HexBadge>
      </div>,
    );

    const clipPathIds = Array.from(container.querySelectorAll("clipPath")).map(
      (el) => el.id,
    );

    expect(clipPathIds).toHaveLength(2);
    expect(clipPathIds[0]).not.toBe(clipPathIds[1]);
  });

  it("scales width to preserve the hex aspect ratio when size changes", () => {
    const { container } = render(
      <HexBadge size={66}>
        <rect />
      </HexBadge>,
    );

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "66");
    expect(svg).toHaveAttribute("width", "58");
  });
});
