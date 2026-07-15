import { test, expect, type Page } from "@playwright/test";

import { gotoHome, navigateToMain } from "../navigators";

test.beforeEach(gotoHome);

function getNthAccentPhraseInput({ page, n }: { page: Page; n: number }) {
  return page.getByLabel(`${n + 1}第N个重音短语的读音`);
}

test("单体重音句的读音", async ({ page }) => {
  await navigateToMain(page);
  await page.waitForTimeout(100);

  const textField = page.getByRole("textbox", { name: "1行" });
  await textField.click();
  await textField.fill("あれもこれもそれもどれも");
  await textField.press("Enter");

  const inputs = Array.from({ length: 4 }, (_, i) =>
    getNthAccentPhraseInput({ page, n: i }),
  );

  // 読点を追加
  await page.getByText("ア", { exact: true }).click();
  await inputs[0].fill("アレモ、");
  await inputs[0].press("Enter");
  await page.waitForTimeout(100);
  await expect(page.getByText("アレモ、")).toBeVisible();

  // 「,」が読点に変換される
  await page.getByText("コ", { exact: true }).click();
  await inputs[1].fill("コレモ,");
  await inputs[1].press("Enter");
  await page.waitForTimeout(100);
  await expect(page.getByText("コレモ、")).toBeVisible();

  // 連続する読点を追加すると１つに集約される
  await page.getByText("ソ", { exact: true }).click();
  await inputs[2].fill("ソレモ,、,、");
  await inputs[2].press("Enter");
  await page.waitForTimeout(100);
  await expect(page.getByText("ソレモ、")).toBeVisible();

  // 最後のアクセント区間に読点をつけても無視される
  await page.getByText("ド", { exact: true }).click();
  await inputs[3].fill("ドレモ,、,、");
  await inputs[3].press("Enter");
  await page.waitForTimeout(100);
  await expect(page.getByText("ドレモ、")).not.toBeVisible();
});

test("详细调整栏的上下文菜单", async ({ page }) => {
  await navigateToMain(page);
  await page.waitForTimeout(100);

  // 删除
  await page.getByRole("textbox", { name: "1行" }).click();
  await page
    .getByRole("textbox", { name: "1行" })
    .fill("あれもこれもそれもどれも");
  await page.getByRole("textbox", { name: "1行" }).press("Enter");
  await page.getByText("ソレモ").click({
    button: "right",
  });
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText("删除") })
    .click();
  await page.waitForTimeout(100);
  await expect(page.getByText("ソレモ")).not.toBeVisible();
  await expect(page.getByText("コレモ")).toBeVisible();
  await expect(page.getByText("ドレモ")).toBeVisible();
});
