import { expect, type Locator, type Page, test } from "@playwright/test";
import { getNewestQuasarDialog, getQuasarMenu } from "./locators";

export async function gotoHome({ page }: { page: Page }) {
  await test.step("转到初始界面", async () => {
    const BASE_URL = "http://localhost:7357/";
    await page.setViewportSize({ width: 1024, height: 630 });
    await page.goto(BASE_URL);
  });
}

export async function navigateToMain(page: Page) {
  await test.step("完成首次启动时的确认，进入主画面", async () => {
    await expect(page.getByText("关于使用条款的通知")).toBeVisible({
      timeout: 90 * 1000,
    });
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "同意并开始使用" }).click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "完成" }).click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "允许" }).click();
    await page.waitForTimeout(100);
  });
}

export async function toggleSetting(page: Page, settingName: string) {
  await test.step(`设置${settingName} `, async () => {
    await page.getByRole("button", { name: "设置" }).click();
    await page.waitForTimeout(100);
    await page.getByText("选项").click();
    await page.waitForTimeout(100);
    await page
      .locator(".row-card", {
        has: page.getByText(settingName),
      })
      .click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "关闭设置" }).click();
  });
  await page.waitForTimeout(500);
}

export async function navigateToHelpDialog(page: Page): Promise<Locator> {
  return await test.step("", async () => {
    await navigateToMain(page);
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "" }).click();
    return getNewestQuasarDialog(page);
  });
}

export async function navigateToSettingDialog(page: Page): Promise<Locator> {
  return await test.step("转到设置界面", async () => {
    await navigateToMain(page);
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "设置" }).click();
    await getQuasarMenu(page, "选项").click();
    return getNewestQuasarDialog(page);
  });
}

export async function navigateToSong(page: Page) {
  await test.step("转到歌曲界面", async () => {
    await navigateToMain(page);
    await expect(page.getByText("歌曲")).toBeVisible();
    await page.getByText("歌曲").click();

    // 見やすいように截图を1/8に変更
    await page.getByLabel("截图").click();
    await page.getByRole("option", { name: "1/8", exact: true }).click();
  });
}
