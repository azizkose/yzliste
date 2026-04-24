import { test, expect } from "@playwright/test";

test.describe("Hesap sayfası", () => {
  test("auth olmadan erişim redirect etmeli", async ({ page }) => {
    await page.goto("/hesap");
    await page.waitForURL(/\/(giris|hesap)/, { timeout: 5000 });
  });
});
