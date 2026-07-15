import { test, expect } from "@playwright/test";
import { gotoHome, navigateToMain } from "../navigators";
import { getQuasarMenu } from "../locators";
import { mockShowSaveFileDialog, mockWriteFile } from "./mockUtility";

test.beforeEach(gotoHome);

test("プロジェクト文件切り替わり案内ダイアログ", async ({ page }) => {
  await navigateToMain(page);

  const dialog = page.getByRole("dialog").filter({
    hasText: /项目 .* 已切换为正在编辑/,
  });

  await test.step("保存项目", async () => {
    await mockShowSaveFileDialog(page);
    await mockWriteFile(page);
    await page.getByRole("button", { name: "文件" }).click();
    await getQuasarMenu(page, "项目另存为").click();
  });

  await test.step("确认对话框未显示", async () => {
    await expect(dialog).not.toBeVisible({ timeout: 1000 });
  });

  await test.step("另存为项目", async () => {
    await mockShowSaveFileDialog(page);
    await mockWriteFile(page);
    await page.getByRole("button", { name: "文件" }).click();
    await getQuasarMenu(page, "项目另存为").click();
  });

  await test.step("确认对话框显示", async () => {
    await expect(dialog).toBeVisible();
  });
});
