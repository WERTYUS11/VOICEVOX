import { test, type Page, type Locator, expect } from "@playwright/test";
import { getQuasarMenu } from "../locators";
import {
  mockReadFile,
  mockShowOpenFileDialog,
  mockShowSaveFileDialog,
  mockWriteFile,
} from "./mockUtility";

/** 等待UI解锁 */
export async function waitForUiUnlock(page: Page): Promise<void> {
  await test.step("等待UI解锁", async () => {
    const addAudioButton = page.getByLabel("添加文本");
    await expect(addAudioButton).toBeEnabled({ timeout: 10 * 1000 });
  });
}

/**
 * ページ内で加载项目。
 *
 * @param projectJson 読み込むプロジェクト文件の内容
 */
export async function loadProject(
  page: Page,
  projectJson: string,
): Promise<void> {
  await test.step("加载项目", async () => {
    const testProjPath = `/tmp/${Date.now()}-testProj.vvproj`;
    await mockReadFile(page, testProjPath, Buffer.from(projectJson, "utf-8"));
    await mockShowOpenFileDialog(page, testProjPath);
    await page.getByRole("button", { name: "文件" }).click();
    await getQuasarMenu(page, "加载项目").click();

    // TODO: 編集中の内容を保存するか問うダイアログに対応する
  });
}

/**
 * 保存项目。
 *
 * @returns 保存されたプロジェクト文件の内容
 */
export async function saveProject(page: Page): Promise<string> {
  return await test.step("保存项目", async () => {
    const writeFileHandle = await mockWriteFile(page);
    const saveFileDialogHandle = await mockShowSaveFileDialog(page);
    await page.getByRole("button", { name: "文件" }).click();
    await getQuasarMenu(page, "保存项目副本").click();
    await waitForUiUnlock(page);
    const [fileId] = await saveFileDialogHandle.getFileIds();
    const writtenFiles = await writeFileHandle.getWrittenFileBuffers();
    const writtenFile = writtenFiles[fileId];
    return writtenFile.toString("utf-8");
  });
}

/** すべてのAudioCellに入力されているテキストを配列で取得する */
export async function collectAllAudioCellContents(
  page: Page,
): Promise<string[]> {
  const count = await page.locator(".audio-cell").count();
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(
      await page
        .getByRole("textbox", { name: `${i + 1}行`, exact: true })
        .inputValue(),
    );
  }
  return results;
}

/** AudioCellの入力欄にテキストを入力する */
export async function fillAudioCell(page: Page, index: number, text: string) {
  const locator = page.locator(".audio-cell input").nth(index);
  await locator.fill(text);
  await locator.press("Enter");
  await page.waitForTimeout(100);
  await validateInput(locator, text);
}

/** input要素の値が期待通りか検証する */
export async function validateInput(locator: Locator, expectedText: string) {
  expect(await locator.inputValue()).toBe(expectedText);
}
