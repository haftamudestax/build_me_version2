import { describe, it, expect } from "vitest";

describe("API integration: /health", () => {
  it("returns ok status", async () => {
    const res = await fetch("http://localhost:4000/health");
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });
});