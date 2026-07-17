import { test, expect } from "@playwright/test";

import { gotoHome, navigateToMain } from "../navigators";

test.beforeEach(gotoHome);

test("「设置」→「管理角色和风格」で「设置 / 管理角色和风格」ページが表示される", async ({
  page,
}) => {
  await navigateToMain(page);
  await page.getByText("设置").click();
  await page.waitForTimeout(100);
  await page.getByText("管理角色和风格").click();
  await page.waitForTimeout(100);
  await expect(
    page.getByText("设置 / 管理角色和风格"),
  ).toBeVisible();
});
