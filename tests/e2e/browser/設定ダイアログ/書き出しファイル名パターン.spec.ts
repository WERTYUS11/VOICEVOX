import { test, expect, type Page, type Locator } from "@playwright/test";

import { gotoHome, navigateToSettingDialog } from "../../navigators";
import { getNewestQuasarDialog } from "../../locators";

test.beforeEach(gotoHome);

/**
 * 导出文件名模式ダイアログまで移動
 */
const moveToFilenameDialog = async (page: Page, settingDialog: Locator) => {
  await settingDialog
    .locator(".row-card", { hasText: "语音：导出文件名模式" })
    .getByRole("button", { name: "编辑" })
    .click();
  await page.waitForTimeout(500);

  const filenameDialog = getNewestQuasarDialog(page);
  await expect(filenameDialog.getByText("导出文件名模式")).toBeVisible();

  const doneButton = filenameDialog.getByRole("button", { name: "确定" });
  const textbox = filenameDialog.getByRole("textbox", {
    name: "文件名模式",
  });

  return { filenameDialog, doneButton, textbox };
};

test("「オプション」から「导出文件名模式」を変更したり保存したりできる", async ({
  page,
}) => {
  const settingDialog = await navigateToSettingDialog(page);

  const { doneButton, textbox: initialTextbox } = await moveToFilenameDialog(
    page,
    settingDialog,
  );
  let textbox = initialTextbox;

  // デフォルト状態は确定ボタンが押せる
  await expect(textbox).toHaveValue("$連番$_$キャラ$（$スタイル$）_$テキスト$");
  await expect(doneButton).toBeEnabled();

  // 何も入力されていないときは确定ボタンが押せない
  await textbox.click();
  await textbox.fill("");
  await textbox.press("Enter");
  await expect(settingDialog.getByText("请输入内容")).toBeVisible();
  await expect(doneButton).toBeDisabled();

  // $連番$ が含まれていない場合は确定ボタンが押せない
  await textbox.click();
  await textbox.fill("test");
  await textbox.press("Enter");
  await expect(textbox).toHaveValue("test");
  await expect(settingDialog.getByText("$連番$ 必需添加")).toBeVisible();
  await expect(doneButton).toBeDisabled();

  // 無効な文字が含まれている場合は确定ボタンが押せない
  await textbox.click();
  await textbox.fill("$連番$\\");
  await textbox.press("Enter");
  await expect(doneButton).toBeDisabled();
  await expect(settingDialog.getByText("包含不可用字符：「\\」")).toBeVisible();

  // $連番$ を含めると确定ボタンが押せる
  await textbox.click();
  await textbox.fill("test");
  await textbox.press("Enter");
  await page.getByRole("button", { name: "$連番$" }).click();
  await expect(textbox).toHaveValue("test$連番$");
  await expect(doneButton).toBeEnabled();
  await page.waitForTimeout(100);

  // 确定するとダイアログが閉じて設定した内容が反映されている
  await doneButton.click();
  await page.waitForTimeout(700);
  await expect(settingDialog.getByText("test$連番$.wav")).toBeVisible();

  // 再度開くと設定した内容が反映されている
  ({ textbox } = await moveToFilenameDialog(page, settingDialog));
  await expect(textbox).toHaveValue("test$連番$");

  // デフォルト値にリセットできる
  await page.getByRole("button", { name: "デフォルトにリセット" }).click();
  await expect(textbox).toHaveValue("$連番$_$キャラ$（$スタイル$）_$テキスト$");
});
