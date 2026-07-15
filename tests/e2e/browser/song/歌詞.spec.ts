import { test, expect, type Page, type Locator } from "@playwright/test";

import { gotoHome, navigateToSong } from "../../navigators";
import { ensureNotNullish } from "@/type/utility";

test.beforeEach(gotoHome);

function getSequencer(page: Page) {
  return page.getByLabel("音序器");
}

async function addNotes(page: Page, count: number) {
  await test.step(`音符添加を${count}个`, async () => {
    const sequencer = getSequencer(page);
    for (let i = 0; i < count; i++) {
      await sequencer.click({ position: { x: (i + 1) * 100, y: 171 } });
    }
    const notes = sequencer.locator(".note");
    await expect(notes).toHaveCount(count);
  });
}

/** Locator の配列を x 座標でソートする */
async function toSortedLocator(locators: Locator[]): Promise<Locator[]> {
  const locatorsWithPosition = await Promise.all(
    locators.map(async (locator) => ({
      locator,
      x: ensureNotNullish(await locator.boundingBox()).x,
    })),
  );
  locatorsWithPosition.sort((a, b) => a.x - b.x);
  return locatorsWithPosition.map(({ locator }) => locator);
}

async function getSortedNotes(page: Page): Promise<Locator[]> {
  return await test.step("音符添加をソートして取得", async () => {
    const sequencer = getSequencer(page);
    const notes = await sequencer.locator(".note").all();
    return toSortedLocator(notes);
  });
}

async function getSortedNoteLylics(page: Page): Promise<string[]> {
  return await test.step("音符添加をソートして歌詞を取得", async () => {
    const sequencer = getSequencer(page);
    const lyrics = await sequencer.locator(".note-lyric").all();
    const sortedLyrics = await toSortedLocator(lyrics);
    return Promise.all(
      sortedLyrics.map(async (lyric) =>
        ensureNotNullish(await lyric.textContent()),
      ),
    );
  });
}

async function editNoteLyric(page: Page, note: Locator, lyric: string) {
  await test.step("音符添加をダブルクリックして歌詞を入力", async () => {
    await note.dblclick();

    const sequencer = getSequencer(page);
    const lyricInput = sequencer.locator(".lyric-input");
    await expect(lyricInput).toBeVisible();
    await lyricInput.fill(lyric);
    await lyricInput.press("Enter");
    await expect(lyricInput).not.toBeVisible();
  });
}

test("双击音符可以编辑歌词", async ({ page }) => {
  await navigateToSong(page);

  await addNotes(page, 1);
  const note = (await getSortedNotes(page))[0];
  const beforeLyric = (await getSortedNoteLylics(page))[0];

  await editNoteLyric(page, note, "あ");

  await test.step("确认歌词已修改", async () => {
    const afterLyric = await getSortedNoteLylics(page);
    expect(afterLyric[0]).not.toEqual(beforeLyric);
    expect(afterLyric[0]).toEqual("あ");
  });
});

test("複数音符添加の歌詞を一度に編集できる", async ({ page }) => {
  await navigateToSong(page);

  await addNotes(page, 3);

  await editNoteLyric(page, (await getSortedNotes(page))[0], "あいう");
  await test.step("全ての音符添加の确认歌词已修改", async () => {
    const afterLyrics = await getSortedNoteLylics(page);
    expect(afterLyrics).toEqual(["あ", "い", "う"]);
  });

  await editNoteLyric(page, (await getSortedNotes(page))[0], "かきくけこ");
  await test.step("最後の音符添加に残りの文字が入力されていることを確認", async () => {
    const afterLyrics = await getSortedNoteLylics(page);
    expect(afterLyrics).toEqual(["か", "き", "くけこ"]);
  });
});
