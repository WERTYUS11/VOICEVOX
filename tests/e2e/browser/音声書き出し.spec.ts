import { test, expect, type Page } from "@playwright/test";
import { gotoHome, navigateToMain } from "../navigators";
import { getQuasarMenu, getNewestQuasarDialog } from "../locators";
import {
  mockShowSaveFileDialog,
  mockWriteFile,
  mockShowSaveDirectoryDialog,
  mockWriteFileError,
} from "./mockUtility";
import { fillAudioCell } from "./utils";

test.beforeEach(gotoHome);

async function exportSelectedAudioAndSnapshot(page: Page, name: string) {
  const { getFileIds } = await mockShowSaveFileDialog(page);
  const { getWrittenFileBuffers } = await mockWriteFile(page);

  await test.step("导出选定的声音", async () => {
    await page.getByRole("button", { name: "文件" }).click();
    await getQuasarMenu(page, "导出选定声音").click();
  });

  await test.step("确认导出完成通知并关闭", async () => {
    const notify = page.getByRole("alert").filter({ hasText: "音频已导出" });
    await expect(notify).toBeVisible();
    await notify.getByRole("button", { name: "关闭" }).click();
    await expect(notify).toBeHidden();
  });

  await test.step("音频文件的二进制快照", async () => {
    const fileId = (await getFileIds())[0];
    const buffer = (await getWrittenFileBuffers())[fileId];
    expect(buffer).toMatchSnapshot(`${name}.wav`);
  });
}

test.describe("语音导出", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToMain(page);

    await test.step("在文本框中输入文本", async () => {
      const accentPhrase = page.locator(".accent-phrase");

      await fillAudioCell(page, 0, "こんにちは、テストです");
      await expect(accentPhrase).not.toHaveCount(0);
    });
  });

  test("根据参数导出语音", async ({ page }) => {
    test.skip(process.platform !== "win32", "跳过Windows系统"); // NOTE: 音声スナップショットが完全一致しないため
    await exportSelectedAudioAndSnapshot(page, "默认");

    const parameters = [
      ["语速", "1.5"],
      ["音高", "0.5"],
      ["抑扬", "1.5"],
      ["音量", "1.5"],
      ["间隙长度", "1.5"],
      ["起始静音", "0.3"],
      ["结束静音", "0.3"],
    ] as const;

    for (const [name, newValue] of parameters) {
      await test.step(`${name}改变`, async () => {
        const input = page.getByLabel(name);
        const originalValue = await input.inputValue();

        await test.step("改变参数", async () => {
          await input.fill(newValue);
          await input.press("Enter");
        });

        await exportSelectedAudioAndSnapshot(page, `${name}改变`);

        await test.step("恢复原值", async () => {
          await input.fill(originalValue);
          await input.press("Enter");
        });
      });
    }
  });

  test("导出选定声音时显示错误对话框", async ({ page }) => {
    await test.step("设置导出错误的模拟", async () => {
      await mockShowSaveFileDialog(page);
      await mockWriteFileError(page);
    });

    await test.step("导出选定的声音", async () => {
      await page.getByRole("button", { name: "文件" }).click();
      await getQuasarMenu(page, "导出选定声音").click();
    });

    await test.step("确认错误对话框并关闭", async () => {
      const dialog = page.getByRole("dialog", {
        name: "导出失败。",
      });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "关闭" }).click();
      await expect(dialog).not.toBeVisible();
    });
  });

  test("导出所有声音时显示错误对话框", async ({ page }) => {
    await test.step("设置导出错误的模拟", async () => {
      await mockShowSaveDirectoryDialog(page);
      await mockWriteFileError(page);
    });

    await test.step("导出所有声音", async () => {
      await page.getByRole("button", { name: "文件" }).click();
      await getQuasarMenu(page, "语音导出").click();
    });

    await test.step("确认结果对话框并关闭", async () => {
      const dialog = getNewestQuasarDialog(page);
      await expect(dialog.getByText("音频导出结果")).toBeVisible();
      await expect(dialog.getByText("1个因写入错误导致的失败")).toBeVisible();
      await dialog.getByRole("button", { name: "关闭" }).click();
      await expect(dialog).not.toBeVisible();
    });
  });

  test("串联音频时显示错误对话框", async ({ page }) => {
    await test.step("设置导出错误的模拟", async () => {
      await mockShowSaveFileDialog(page);
      await mockWriteFileError(page);
    });

    await test.step("串联音频并导出", async () => {
      await page.getByRole("button", { name: "文件" }).click();
      await getQuasarMenu(page, "串联音频并导出").click();
    });

    await test.step("确认错误对话框并关闭", async () => {
      const dialog = page.getByRole("dialog", {
        name: "导出失败。",
      });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "关闭" }).click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
