import { test, expect } from "@playwright/test";

const publicPages = [
  "/",
  "/fiyatlar",
  "/sss",
  "/blog",
  "/giris",
  "/kayit",
  "/gizlilik",
  "/kosullar",
  "/mesafeli-satis",
  "/teslimat-iade",
];

test.describe("Public sayfalar", () => {
  for (const page of publicPages) {
    test(`${page} 200 dönmeli`, async ({ request }) => {
      const response = await request.get(page);
      expect(response.status()).toBe(200);
    });
  }

  test("404 sayfası çalışmalı", async ({ page }) => {
    const response = await page.goto("/olmayan-sayfa");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=sayfa bulunamadı")).toBeVisible({ timeout: 5000 });
  });

  test("health endpoint 200 dönmeli", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });
});
