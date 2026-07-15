import { test, expect } from "@playwright/test";

import { gotoHome, navigateToMain } from "../navigators";
import { getNewestQuasarDialog, getQuasarMenu } from "../locators";

test.beforeEach(gotoHome);

test("可以在自定义工具栏中添加按钮，也可以恢复默认", async ({ page }) => {
  await navigateToMain(page);
  // 全部导出ボタンはデフォルトでないことを確認
  expect(
    await page
      .locator("header")
      .getByRole("toolbar")
      .getByText("全部导出")
      .count(),
  ).toBe(0);

  // 自定义工具栏ページに移動
  await page.getByText("设置").click();
  await page.waitForTimeout(100);
  await getQuasarMenu(page, "自定义工具栏").click();
  await expect(
    getNewestQuasarDialog(page).getByText("自定义工具栏"),
  ).toBeVisible();

  // 全部导出ボタンを追加する
  expect(
    await page.getByRole("button").filter({ hasText: "全部导出" }).count(),
  ).toBe(0);
  await page.getByRole("listitem").filter({ hasText: "全部导出" }).click();
  expect(
    await page.getByRole("button").filter({ hasText: "全部导出" }).count(),
  ).toBe(1);
  await page.getByText("保存", { exact: true }).click();
  await getNewestQuasarDialog(page)
    .getByRole("button", { name: "关闭自定义工具栏" })
    .click();

  // 閉じたあとに全部导出ボタンが追加されてることを確認
  await page.waitForTimeout(100);
  expect(
    await page
      .locator("header")
      .getByRole("toolbar")
      .getByText("全部导出")
      .count(),
  ).toBe(1);

  // 再度自定义工具栏ページに移動し、恢复默认ボタンを押す
  await page.getByText("设置").click();
  await page.waitForTimeout(100);
  await getQuasarMenu(page, "自定义工具栏").click();
  await page.waitForTimeout(100);
  expect(
    await page
      .locator("main")
      .getByRole("button")
      .filter({ hasText: "全部导出" })
      .count(),
  ).toBe(1);
  await page.getByText("恢复默认").click();
  await page
    .locator(".DialogContent")
    .last()
    .getByRole("button")
    .filter({ hasText: "恢复默认" })
    .click();
  await page.getByText("保存", { exact: true }).click();
  expect(
    await page
      .locator("main")
      .getByRole("button")
      .filter({ hasText: "全部导出" })
      .count(),
  ).toBe(0);

  // 閉じるボタンを再度押し、全部导出ボタンが消えてることを確認
  await getNewestQuasarDialog(page)
    .getByRole("button", { name: "关闭自定义工具栏" })
    .click();

  await page.waitForTimeout(100);
  expect(
    await page
      .locator("header")
      .getByRole("toolbar")
      .getByText("全部导出")
      .count(),
  ).toBe(0);
});
