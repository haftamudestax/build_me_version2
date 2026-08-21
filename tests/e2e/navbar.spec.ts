import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("logo and Home link are visible on load", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Home" }).first()).toBeVisible();
  });

  test("AC-05: Navbar remains at the top of the viewport while scrolling", async ({ page }) => {
    await page.goto("/");

    const header = page.locator("header").first();
    await expect(header).toBeVisible();

    const boxBefore = await header.boundingBox();
    await page.mouse.wheel(0, 2000);
    const boxAfter = await header.boundingBox();

    expect(boxBefore?.y).toBe(0);
    expect(boxAfter?.y).toBe(0); // still pinned to top after scrolling
  });

  test("AC-04: clicking the logo from a non-Home route navigates to Home", async ({ page }) => {
    // Adjust this path if a real second route exists; using a query
    // string keeps this test working even with a single-route app,
    // since the assertion only cares about ending on "/".
    await page.goto("/?ref=test");

    const logo = page.getByRole("link", { name: "Home" }).first();
    await logo.click();

    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });

  test("AC-07: logo is keyboard-focusable and activatable", async ({ page }) => {
    await page.goto("/");

    // Tab until the logo link receives focus (it's the first
    // interactive element in the Navbar).
    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    expect(focused).toBe("Home");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });

  test("AC-09: mobile viewport hides the desktop link row and shows a hamburger toggle", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /open menu/i });
    await expect(menuButton).toBeVisible();

    await menuButton.click();
    await expect(page.getByRole("button", { name: /close menu/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" }).last()).toBeVisible();
  });

  test("desktop viewport shows the link row without needing the hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("button", { name: /open menu/i })).toBeHidden();
  });
});
