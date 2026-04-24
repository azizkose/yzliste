import { test, expect } from "@playwright/test";

test.describe("Auth sayfaları", () => {
  test("giriş sayfası yüklenmeli", async ({ page }) => {
    await page.goto("/giris");
    await expect(page.locator("text=Giriş Yap")).toBeVisible({ timeout: 5000 });
  });

  test("kayıt sayfası yüklenmeli", async ({ page }) => {
    await page.goto("/kayit");
    await expect(page.locator("text=Kayıt Ol")).toBeVisible({ timeout: 5000 });
  });

  test("auth olmadan /uret erişimi redirect etmeli", async ({ page }) => {
    await page.goto("/uret");
    await page.waitForURL(/\/(giris|uret)/, { timeout: 5000 });
  });
});
