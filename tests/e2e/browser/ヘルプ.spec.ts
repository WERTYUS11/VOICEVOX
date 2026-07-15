import { test, expect } from "@playwright/test";

import { gotoHome, navigateToHelpDialog } from "../navigators";

test.beforeEach(gotoHome);

test("点击帮助菜单中的每个项目，即可显示该项目的内容", async ({ page }) => {
  await navigateToHelpDialog(page);
  // 联系我们
  await page.getByText("联系我们").click();
  await expect(page.getByText("帮助 / 联系我们")).toBeVisible();

  // 软件使用协议
  await page.getByText("软件使用协议", { exact: true }).click();
  await expect(page.getByText("帮助 / 软件使用协议")).toBeVisible();

  // 语音库使用协议
  await page.getByText("语音库使用协议", { exact: true }).click();
  await expect(page.getByText("帮助 / 语音库使用协议")).toBeVisible();

  // 使用方法
  await page.getByText("使用方法", { exact: true }).click();
  await expect(page.getByText("帮助 / 使用方法")).toBeVisible();

  // 开发社区
  await page.getByText("开发社区", { exact: true }).click();
  await expect(page.getByText("帮助 / 开发社区")).toBeVisible();

  // 许可证信息
  await page.getByText("许可证信息", { exact: true }).click();
  await expect(page.getByText("帮助 / 许可证信息")).toBeVisible();

  // 更新信息
  await page.getByText("更新信息", { exact: true }).click();
  await expect(page.getByText("帮助 / 更新信息")).toBeVisible();

  // 常见问题
  await page.getByText("常见问题", { exact: true }).click();
  await expect(page.getByText("帮助 / 常见问题")).toBeVisible();
});
