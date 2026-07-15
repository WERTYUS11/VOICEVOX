import { test, expect, type Page } from "@playwright/test";

import { gotoHome, navigateToSong } from "../../navigators";
import { ensureNotNullish } from "@/type/utility";

test.beforeEach(gotoHome);

async function getCurrentPlayhead(page: Page) {
  const boundingBox = await page
    .getByTestId("sequencer-playhead")
    .boundingBox();
  if (boundingBox == null) throw new Error("找不到播放栏");
  return boundingBox;
}

test("按播放按钮即可播放", async ({ page }) => {
  await navigateToSong(page);
  // TODO: ページ内のオーディオを検出するテストを追加する

  const sequencer = page.getByLabel("音序器");

  await sequencer.click({ position: { x: 100, y: 171 } }); // ノートを追加
  const beforePosition = await getCurrentPlayhead(page); // 再生ヘッドの初期位置
  await page.getByText("play_arrow").click(); // 再生ボタンを押す
  await page.waitForTimeout(3000);
  await page.getByText("stop").click(); // 停止ボタンを押す
  const afterPosition = await getCurrentPlayhead(page); // 再生ヘッドの再生後の位置
  expect(afterPosition.x).not.toEqual(beforePosition.x);
  expect(afterPosition.y).toEqual(beforePosition.y);
});

test("可以添加或删除音符", async ({ page }) => {
  await navigateToSong(page);

  const sequencer = page.getByLabel("音序器");

  const getCurrentNoteCount = async () =>
    await sequencer.locator(".note").count();

  await test.step("添加音符", async () => {
    expect(await getCurrentNoteCount()).toBe(0);
    await sequencer.click({ position: { x: 100, y: 171 } });
    expect(await getCurrentNoteCount()).toBe(1);
    await sequencer.click({ position: { x: 200, y: 171 } });
    expect(await getCurrentNoteCount()).toBe(2);
  });

  await test.step("删除音符", async () => {
    expect(await getCurrentNoteCount()).toBe(2);
    await sequencer.click({ position: { x: 100, y: 171 } });
    await page.keyboard.press("Delete");
    expect(await getCurrentNoteCount()).toBe(1);
    await sequencer.click({ position: { x: 200, y: 171 } });
    await page.keyboard.press("Delete");
    expect(await getCurrentNoteCount()).toBe(0);
  });
});

test("可以在长音符范围内拖动添加", async ({ page }) => {
  await navigateToSong(page);

  const sequencer = page.getByLabel("音序器");

  await test.step("点击添加短音符", async () => {
    await sequencer.click({ position: { x: 100, y: 171 } });
  });

  await test.step("可以在长音符范围内拖动添加", async () => {
    const startPos = { x: 200, y: 171 };
    const endPos = { x: 400, y: 171 };
    await sequencer.hover({ position: startPos });
    await page.mouse.down();
    await page.mouse.move(endPos.x, endPos.y);
    await page.mouse.up();
  });

  await test.step("等待第二个音符显示，确认第二个音符是否为长音符", async () => {
    const notes = sequencer.locator(".note");
    await expect(notes).toHaveCount(2);

    const firstNoteBox = ensureNotNullish(await notes.nth(0).boundingBox());
    const secondNoteBox = ensureNotNullish(await notes.nth(1).boundingBox());
    expect(secondNoteBox.width).toBeGreaterThanOrEqual(firstNoteBox.width * 2);
  });
});
