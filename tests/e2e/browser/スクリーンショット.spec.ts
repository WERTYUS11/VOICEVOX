import { test, expect } from "@playwright/test";
import { gotoHome, navigateToMain } from "../navigators";

test.beforeEach(gotoHome);

test("显示主界面", async ({ page }) => {
  test.skip(process.platform !== "win32", "跳过 Windows 以外的系统");
  await navigateToMain(page);

  // 对话模式屏幕截图の表示
  while (true) {
    await page.locator(".audio-cell:nth-child(1) .q-field").click(); // 一番上のテキスト欄をクリックする
    await page.waitForTimeout(100);
    // ローディングが消えるまで待つ
    if (
      (await page
        .locator(".character-portrait-wrapper .character-name")
        .innerText()) !== "（显示错误）" &&
      (await page.locator(".character-portrait-wrapper .loading").count()) === 0
    ) {
      break;
    }
  }
  await expect(page).toHaveScreenshot("对话模式屏幕截图.png");

  // 歌曲模式屏幕截图の表示
  await page.getByText("歌曲模式").click();
  await expect(page.getByText("歌曲模式")).toBeEnabled(); // 無効化が解除されるまで待つ
  await expect(page).toHaveScreenshot("歌曲模式屏幕截图.png");
});
