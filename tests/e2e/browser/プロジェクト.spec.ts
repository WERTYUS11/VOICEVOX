import fs from "node:fs/promises";
import { test, expect } from "@playwright/test";

import { gotoHome, navigateToMain } from "../navigators";
import {
  collectAllAudioCellContents,
  fillAudioCell,
  loadProject,
  saveProject,
  waitForUiUnlock,
} from "./utils";

test.beforeEach(gotoHome);

test("加载旧项目", async ({ page }) => {
  await navigateToMain(page);
  const projectJson = await fs.readFile(
    `${import.meta.dirname}/vvproj/0.14.11.vvproj`,
    "utf-8",
  );
  const textContent = await fs.readFile(
    `${import.meta.dirname}/vvproj/0.14.11.txt`,
    "utf-8",
  );
  await loadProject(page, projectJson);
  await waitForUiUnlock(page);
  expect(await collectAllAudioCellContents(page)).toEqual(
    textContent.split("\n").filter((line) => line.length > 0),
  );
});

test("保存项目后可以直接加载", async ({ page }) => {
  const savedProject =
    await test.step("在AudioCell中输入文本后保存", async () => {
      await navigateToMain(page);

      await page.getByRole("button").filter({ hasText: "add" }).click();
      await page.getByRole("button").filter({ hasText: "add" }).click();
      await fillAudioCell(page, 0, "hoge");
      await fillAudioCell(page, 1, "fuga");
      await fillAudioCell(page, 2, "piyo");
      expect(await collectAllAudioCellContents(page)).toEqual([
        "hoge",
        "fuga",
        "piyo",
      ]);

      return await saveProject(page);
    });

  await test.step("可以直接加载保存的项目", async () => {
    await page.reload();
    await gotoHome({ page });

    await loadProject(page, savedProject);
    await waitForUiUnlock(page);
    expect(await collectAllAudioCellContents(page)).toEqual([
      "hoge",
      "fuga",
      "piyo",
    ]);
  });
});

test("加载新版本时会显示警告", async ({
  page,
}) => {
  await navigateToMain(page);
  const content = await fs.readFile(
    `${import.meta.dirname}/vvproj/future.vvproj`,
    "utf-8",
  );
  await loadProject(page, content);
  await expect(
    page.getByText(
      "项目文件由新版本的 VOICEVOX 创建",
    ),
  ).toBeVisible();
});
