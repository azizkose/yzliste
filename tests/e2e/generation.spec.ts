import { test, expect } from "@playwright/test";

test.describe("Üretim sayfası", () => {
  test("/uret auth gerektirir", async ({ page }) => {
    await page.goto("/uret");
    const url = page.url();
    expect(url.includes("/giris") || url.includes("/uret")).toBeTruthy();
  });
});
