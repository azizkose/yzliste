import { test, expect } from "@playwright/test";

test.describe("Fiyatlar sayfası", () => {
  test("paket kartları görünmeli", async ({ page }) => {
    await page.goto("/fiyatlar");
    await expect(page.locator("text=Başlangıç")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Popüler")).toBeVisible({ timeout: 5000 });
  });

  test("JSON-LD structured data bulunmalı", async ({ page }) => {
    await page.goto("/fiyatlar");
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain("Product");
    expect(jsonLd).toContain("image");
  });
});
