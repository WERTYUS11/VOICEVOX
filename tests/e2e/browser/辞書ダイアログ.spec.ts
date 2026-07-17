import { test, expect, type Page, type Locator } from "@playwright/test";
import { gotoHome, navigateToMain } from "../navigators";
import { getNewestQuasarDialog } from "../locators";

test.beforeEach(gotoHome);

/**
 * テスト内で添加する单词名を生成する。
 */
function createUniqueSurfaceCreator(): (label: string) => string {
  let surfaceIndex = 0;
  return (label: string) => {
    surfaceIndex++;
    return `辞書${label}${"あ".repeat(surfaceIndex)}`;
  };
}
const createSurface = createUniqueSurfaceCreator();

/**
 * 最後のテキスト欄にテキストを入力し、その读音を取得する。
 * 確実に读音を反映させるために、一度空にしてから入力する。
 */
async function getYomi(page: Page, inputText: string): Promise<string> {
  const audioCellInput = page.getByRole("textbox", { name: "行" }).last();
  const accentPhrase = page.locator(".accent-phrase");

  // 空にする
  await audioCellInput.click();
  await audioCellInput.fill("");
  await audioCellInput.press("Enter");
  await expect(accentPhrase).not.toBeVisible();

  // 入力する
  await audioCellInput.click();
  await audioCellInput.fill(inputText);
  await audioCellInput.press("Enter");
  await expect(accentPhrase).not.toHaveCount(0);

  return (await accentPhrase.allTextContents()).join("");
}

/**
 * 设置メニューから读音方＆アクセント打开词典对话框。
 * 辞書の读音込みと同期が終わるまで待つ。
 */
async function openDictDialog(page: Page): Promise<void> {
  await test.step("打开词典对话框", async () => {
    await page.getByRole("button", { name: "设置" }).click();
    await page.waitForTimeout(100);
    await page.getByText("读法和重音词典").click();
    await expect(
      getNewestQuasarDialog(page).getByText("单词列表"),
    ).toBeVisible();
    await expect(page.getByText("加载中...")).toBeHidden();
    await expect(page.getByText("同步中...")).toBeHidden();
  });
}

/**
 * 读法和重音词典ダイアログを閉じる。
 */
async function closeDictDialog(page: Page): Promise<void> {
  await test.step("关闭词典对话框", async () => {
    await getNewestQuasarDialog(page)
      .getByRole("button", { name: "关闭词典" })
      .click();
    await expect(
      getNewestQuasarDialog(page).getByText("单词列表"),
    ).toBeHidden();
  });
}

/**
 * 单词編集画面の入力欄を取得する。
 */
function getWordField(page: Page, label: "单词" | "读音"): Locator {
  return page.getByRole("textbox", { name: label });
}

/**
 * 单词列表から指定した单词の項目を取得する。
 */
function getWordItem(page: Page, surface: string): Locator {
  return page.getByRole("listitem").filter({ hasText: surface });
}

/**
 * BaseTextField に値を入力する。
 * contenteditable の入力欄なので、テキストを直接差し替えて input イベントを発火させる。
 */
async function fillTextField(
  input: Locator,
  value: string,
  expectedValue = value,
): Promise<void> {
  await input.evaluate((element: HTMLElement, text: string) => {
    element.textContent = text;
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
  await input.press("Enter");
  await expect(input).toHaveText(expectedValue);
}

/**
 * 打开新单词添加画面。
 */
async function selectNewWord(page: Page): Promise<void> {
  await test.step("打开新单词添加画面", async () => {
    await getNewestQuasarDialog(page)
      .getByRole("button", { name: "添加" })
      .click();
    await expect(page.getByText("添加单词")).toBeVisible();
  });
}

/**
 * 单词編集画面で输入单词和读音。
 * 单词は入力後に全角化される場合があるため、表示上の期待値を別に指定できる。
 */
async function fillWord(
  page: Page,
  surface: string,
  yomi: string,
  expectedSurface = surface,
) {
  await test.step("输入单词和读音", async () => {
    await fillTextField(getWordField(page, "单词"), surface, expectedSurface);
    await fillTextField(getWordField(page, "读音"), yomi);
    await expect(page.locator(".detail .accent-phrase-table")).toBeVisible();
  });
}

/**
 * 新しい添加して、添加後の編集画面まで移動する。
 */
async function addWord(
  page: Page,
  surface: string,
  yomi: string,
  expectedSurface = surface,
): Promise<void> {
  await selectNewWord(page);
  await fillWord(page, surface, yomi, expectedSurface);

  await test.step("添加する", async () => {
    await getNewestQuasarDialog(page)
      .locator("footer")
      .getByRole("button", { name: "添加" })
      .click();
    await expect(getWordItem(page, expectedSurface)).toBeVisible();
    await expect(page.getByText("编辑单词")).toBeVisible();
  });
}

/**
 * 单词列表から指定した单词选择。
 */
async function selectWord(page: Page, surface: string): Promise<void> {
  await test.step(`${surface}选择`, async () => {
    await getWordItem(page, surface).click();
    await expect(page.getByText("编辑单词")).toBeVisible();
    await expect(getWordField(page, "单词")).toHaveText(surface);
  });
}

/**
 * 指定した单词の删除確認ダイアログを開く。
 */
async function openDeleteWordDialog(
  page: Page,
  surface: string,
): Promise<Locator> {
  return await test.step("打开单词删除对话框", async () => {
    const wordItem = getWordItem(page, surface);
    await wordItem.hover();
    await wordItem.getByRole("button", { name: "删除" }).click();
    const dialog = page.getByRole("dialog", { name: "要删除该单词吗？" });
    await expect(dialog).toBeVisible();
    return dialog;
  });
}

/**
 * 指定したタイトルの警告ダイアログを取得する。
 */
async function expectWarningDialog(
  page: Page,
  title: string,
): Promise<Locator> {
  const dialog = page.getByRole("dialog", { name: title });
  await expect(dialog).toBeVisible();
  return dialog;
}

test("可以显示词典对话框", async ({ page }) => {
  await navigateToMain(page);
  await openDictDialog(page);
});

test("添加できる", async ({ page }) => {
  const surface = createSurface("添加");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "テスト");

  await test.step("添加的单词会显示在列表中", async () => {
    await expect(getWordItem(page, surface)).toBeVisible();
    await expect(getWordItem(page, surface)).toContainText("テスト");
  });
});

test("可以删除单词", async ({ page }) => {
  const surface = createSurface("删除");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "テスト");
  const dialog = await openDeleteWordDialog(page, surface);

  await test.step("确认删除", async () => {
    await dialog.getByRole("button").filter({ hasText: "删除" }).click();
    await expect(getWordItem(page, surface)).toBeHidden();
  });
});

test("可以取消删除单词", async ({ page }) => {
  const surface = createSurface("取消删除");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "テスト");
  const dialog = await openDeleteWordDialog(page, surface);

  await test.step("取消删除", async () => {
    await dialog.getByRole("button").filter({ hasText: "保存" }).click();
    await expect(getWordItem(page, surface)).toBeVisible();
  });
});

test("输入新单词后尝试切换到其他单词时会显示放弃警告", async ({
  page,
}) => {
  const existingSurface = createSurface("已有");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, existingSurface, "テスト");
  await selectNewWord(page);
  await fillWord(page, createSurface("未保存"), "ヨミ");

  await test.step("尝试选择其他单词", async () => {
    await getWordItem(page, existingSurface).click();
    const dialog = await expectWarningDialog(
      page,
      "要放弃添加单词吗？",
    );
    await expect(
      dialog.getByText("若丢弃更改，则将会重置单词的添加。"),
    ).toBeVisible();
  });
});

test("编辑单词后选择其他单词会被保存", async ({ page }) => {
  const firstSurface = createSurface("編集元");
  const secondSurface = createSurface("編集先");
  const editedSurface = `${firstSurface}更改`;

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, firstSurface, "テスト");
  await addWord(page, secondSurface, "サンプル");
  await selectWord(page, firstSurface);

  await test.step("编辑单词后选择其他单词", async () => {
    await fillTextField(getWordField(page, "单词"), editedSurface);
    await getWordItem(page, secondSurface).click();
    await expect(getWordField(page, "单词")).toHaveText(secondSurface);
  });

  await selectWord(page, editedSurface);
});

test("编辑单词后关闭对话框会被保存", async ({ page }) => {
  const surface = createSurface("閉じる保存");
  const editedSurface = `${surface}更改`;

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "テスト");
  await selectWord(page, surface);

  await test.step("编辑单词后关闭对话框", async () => {
    await fillTextField(getWordField(page, "单词"), editedSurface);
  });

  await closeDictDialog(page);
  await openDictDialog(page);
  await selectWord(page, editedSurface);
});

test("选择其他单词后坚持更改，编辑画面会保持不变", async ({
  page,
}) => {
  const firstSurface = createSurface("無効維持");
  const secondSurface = createSurface("無効維持先");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, firstSurface, "テスト");
  await addWord(page, secondSurface, "サンプル");
  await selectWord(page, firstSurface);

  await test.step("使读音变为无效状态", async () => {
    await fillTextField(getWordField(page, "读音"), "abc");
    await expect(
      page.getByText("使用了平假名和片假名以外的字符。"),
    ).toBeVisible();
  });

  await test.step("坚持更改后，单词会保持不变", async () => {
    await getWordItem(page, secondSurface).click();
    const dialog = await expectWarningDialog(
      page,
      "要取消单词的更改吗？",
    );
    await dialog.getByRole("button").filter({ hasText: "坚持更改" }).click();
    await expect(getWordField(page, "单词")).toHaveText(firstSurface);
    await expect(getWordField(page, "读音")).toHaveText("abc");
  });
});

test("使单词变为无效状态后尝试选择其他单词，如果放弃则切换", async ({
  page,
}) => {
  const firstSurface = createSurface("無効破棄");
  const secondSurface = createSurface("無効破棄先");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, firstSurface, "テスト");
  await addWord(page, secondSurface, "サンプル");
  await selectWord(page, firstSurface);

  await test.step("使读音变为无效状态", async () => {
    await fillTextField(getWordField(page, "读音"), "abc");
    await expect(
      page.getByText("使用了平假名和片假名以外的字符。"),
    ).toBeVisible();
  });

  await test.step("放弃则会切换到其他单词", async () => {
    await getWordItem(page, secondSurface).click();
    const dialog = await expectWarningDialog(
      page,
      "要取消单词的更改吗？",
    );
    await dialog.getByRole("button").filter({ hasText: "放弃" }).click();
    await expect(getWordField(page, "单词")).toHaveText(secondSurface);
  });
});

test("单词を無効な状態にしたあと选择相同单词后放弃，编辑内容会恢复", async ({
  page,
}) => {
  const surface = createSurface("同じ单词破棄");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "テスト");
  await selectWord(page, surface);

  await test.step("使读音变为无效状态", async () => {
    await fillTextField(getWordField(page, "读音"), "abc");
    await expect(
      page.getByText("使用了平假名和片假名以外的字符。"),
    ).toBeVisible();
  });

  await test.step("选择相同单词后放弃，编辑内容会恢复", async () => {
    await getWordItem(page, surface).click();
    const dialog = await expectWarningDialog(
      page,
      "要取消单词的更改吗？",
    );
    await dialog.getByRole("button").filter({ hasText: "放弃" }).click();
    await expect(getWordField(page, "单词")).toHaveText(surface);
    await expect(getWordField(page, "读音")).toHaveText("テスト");
    await expect(
      page.getByText("使用了平假名和片假名以外的字符。"),
    ).toBeHidden();
  });
});

test("可以重置新单词的输入", async ({ page }) => {
  await navigateToMain(page);
  await openDictDialog(page);
  await selectNewWord(page);
  await fillWord(page, createSurface("重置"), "テスト");

  await test.step("重置输入", async () => {
    await getNewestQuasarDialog(page)
      .locator("footer")
      .getByRole("button", { name: "重置" })
      .click();
    await expect(getWordField(page, "单词")).toHaveText("");
    await expect(getWordField(page, "读音")).toHaveText("");
    await expect(page.locator(".detail .accent-phrase-table")).toBeHidden();
    await expect(
      getNewestQuasarDialog(page)
        .locator("footer")
        .getByRole("button", { name: "添加" }),
    ).toBeDisabled();
  });
});

test("输入新单词后选择添加再放弃，输入内容会恢复", async ({
  page,
}) => {
  await navigateToMain(page);
  await openDictDialog(page);
  await selectNewWord(page);
  await fillWord(page, createSurface("重新选择添加"), "テスト");

  await test.step("选择添加后放弃，输入内容会恢复", async () => {
    await getNewestQuasarDialog(page)
      .getByRole("button", { name: "添加" })
      .click();
    const dialog = await expectWarningDialog(
      page,
      "要放弃添加单词吗？",
    );
    await dialog.getByRole("button").filter({ hasText: "放弃" }).click();
    await expect(getWordField(page, "单词")).toHaveText("");
    await expect(getWordField(page, "读音")).toHaveText("");
    await expect(page.locator(".detail .accent-phrase-table")).toBeHidden();
  });
});

test("用平假名输入读音时会以片假名保存", async ({ page }) => {
  const surface = createSurface("ひらがな");

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "てすと");

  await test.step("读音以片假名显示", async () => {
    await expect(getWordItem(page, surface)).toContainText("テスト");
  });
});

test("用半角输入单词时会以全角保存", async ({ page }) => {
  const surface = "abc123";
  const convertedSurface = "ａｂｃ１２３";

  await navigateToMain(page);
  await openDictDialog(page);
  await addWord(page, surface, "テスト", convertedSurface);

  await test.step("单词以全角显示", async () => {
    await expect(getWordItem(page, convertedSurface)).toBeVisible();
  });
});

test("添加した单词がテキストの读音に反映され、删除と反映されなくなる", async ({
  page,
}) => {
  const targetString = createSurface("反映");

  await navigateToMain(page);

  // 文字列を入力して读音方を記憶する
  const yomi = await test.step("获取注册前的读音", async () => {
    return await getYomi(page, targetString);
  });

  await openDictDialog(page);
  await addWord(page, targetString, "テスト");
  await closeDictDialog(page);

  await test.step("添加的单词会反映到读音中", async () => {
    await page.getByRole("button").filter({ hasText: "add" }).click();
    expect(await getYomi(page, targetString)).toBe("テスト");
  });

  await openDictDialog(page);
  const dialog = await openDeleteWordDialog(page, targetString);

  await test.step("删除单词后关闭对话框", async () => {
    await dialog.getByRole("button").filter({ hasText: "删除" }).click();
  });

  await closeDictDialog(page);

  // 辞書から删除されていることを確認
  // （＝最初の读音方と同じになっていることを確認）
  await test.step("删除的单词不会反映在读音中", async () => {
    await page.getByRole("button").filter({ hasText: "add" }).click();
    expect(await getYomi(page, targetString)).toBe(yomi);
  });
});
