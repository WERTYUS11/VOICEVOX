import { test, expect } from "@playwright/test";
import { gotoHome } from "../navigators";

test.beforeEach(gotoHome);

test("启动后将显示使用条款对话框和使用条款内容", async ({
  page,
}) => {
  await expect(page.getByText("关于使用条款的通知")).toBeVisible({
    timeout: 90 * 1000,
  });

  await test.step("确认使用条款内容是否显示", async () => {
    await expect(page.getByText("使用条款条约")).toBeVisible();
  });
});

test("同意使用条款前各种UI将禁用", async ({ page }) => {
  await expect(page.getByText("关于使用条款的通知")).toBeVisible({
    timeout: 90 * 1000,
  });

  // 歌曲ボタン
  const songButton = page.getByRole("toolbar").getByText("歌曲");
  await expect(songButton).toBeVisible();
  await expect(songButton).toBeDisabled();
});
