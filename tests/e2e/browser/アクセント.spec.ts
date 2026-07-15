import { test, expect } from "@playwright/test";

import { gotoHome, navigateToMain } from "../navigators";

test.beforeEach(gotoHome);

test("重音分割后会增加重音区间", async ({ page }) => {
  await navigateToMain(page);
  await expect(page.locator(".audio-cell").first()).toBeVisible();
  await page.locator(".audio-cell input").first().fill("こんにちは");
  await page.locator(".audio-cell input").first().press("Enter");
  await page.waitForTimeout(500);
  expect(await page.locator(".accent-phrase").count()).toBe(1);
  await (await page.locator(".splitter-cell").all())[1].click();
  await page.waitForTimeout(500);
  expect(await page.locator(".accent-phrase").count()).toBe(2);
});

test("点击重音读音部分可以改变重音读音", async ({ page }) => {
  await navigateToMain(page);

  await page.getByRole("textbox", { name: "1行" }).click();
  await page.getByRole("textbox", { name: "1行" }).fill("テストです");
  await page.getByRole("textbox", { name: "1行" }).press("Enter");
  const accentPhrase = page.locator(".accent-phrase");
  await expect(accentPhrase).toHaveText("テストデス");

  await expect(page.locator(".text-cell").first()).toBeVisible();
  await page.locator(".text-cell").first().click();
  const input = page.getByLabel("第1个重音短语的读音");
  expect(await input.inputValue()).toBe("テストデス");
  await input.fill("テストテスト");
  await input.press("Enter");
  await expect(accentPhrase).toHaveText("テストテスト");
});
