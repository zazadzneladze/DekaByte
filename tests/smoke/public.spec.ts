import { test, expect } from "@playwright/test";

test.describe("public smoke", () => {
  test("homepage loads with hero and nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "მთავარი" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "ნამუშევრები" }).first()).toBeVisible();
  });

  test("work page", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByRole("heading", { name: "ნამუშევრები" })).toBeVisible();
  });

  test("invalid project slug shows not found", async ({ page }) => {
    await page.goto("/work/this-slug-does-not-exist-xyz");
    await expect(
      page.getByRole("heading").filter({ hasText: /ვერ მოიძებნა|404|ნაპოვნი/i }).first(),
    ).toBeVisible();
  });

  test("estimate calculator", async ({ page }) => {
    await page.goto("/estimate");
    await expect(
      page.getByText(/საწყის სავარაუდო დიაპაზონს|საწყის სავარაუდო შეფასებას/).first(),
    ).toBeVisible();
  });

  test("contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "კონტაქტი" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /სახელი/ })).toBeVisible();
  });

  test("services, about, privacy, terms", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("admin smoke", () => {
  test("admin routes redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin login page renders", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /ადმინ/ })).toBeVisible();
  });
});
