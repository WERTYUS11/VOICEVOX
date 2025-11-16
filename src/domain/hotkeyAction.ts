import { z } from "zod";

const hotkeyCombinationSchema = z.string().brand("HotkeyCombination");
export type HotkeyCombination = z.infer<typeof hotkeyCombinationSchema>;
export const HotkeyCombination = (
  hotkeyCombination: string,
): HotkeyCombination => hotkeyCombinationSchema.parse(hotkeyCombination);

// 共通のアクション名
export const actionPostfixSelectNthCharacter = "番目のキャラクターを選択";

export const hotkeyActionNameSchema = z.enum([
  "语音导出",
  "选择并导出声音",
  "剪辑并导出声音",
  "播放/停止",
  "连续播放/停止",
  "显示重音栏",
  "显示语调字段",
  "显示长度栏",
  "添加文本栏",
  "复制文本字段",
  "删除文本字段",
  "从文本字段移出焦点",
  "重新聚焦文本字段",
  "恢复",
  "重新开始",
  "新项目",
  "保存并覆盖项目",
  "命名并保存项目",
  "保存项目副本",
  "加载项目",
  "加载文本",
  "重置语调",
  "重置所选重音短语语调",
  "复制",
  "剪切",
  "粘贴",
  "全选",
  "取消选择",
  `1${actionPostfixSelectNthCharacter}`,
  `2${actionPostfixSelectNthCharacter}`,
  `3${actionPostfixSelectNthCharacter}`,
  `4${actionPostfixSelectNthCharacter}`,
  `5${actionPostfixSelectNthCharacter}`,
  `6${actionPostfixSelectNthCharacter}`,
  `7${actionPostfixSelectNthCharacter}`,
  `8${actionPostfixSelectNthCharacter}`,
  `9${actionPostfixSelectNthCharacter}`,
  `10${actionPostfixSelectNthCharacter}`,
  "全屏显示",
  "放大",
  "缩小",
  "重置放大率",
]);
export type HotkeyActionNameType = z.infer<typeof hotkeyActionNameSchema>;

export const hotkeySettingSchema = z.object({
  action: hotkeyActionNameSchema,
  combination: hotkeyCombinationSchema,
});
export type HotkeySettingType = z.infer<typeof hotkeySettingSchema>;

export function getDefaultHotkeySettings({
  isMac,
}: {
  isMac: boolean;
}): HotkeySettingType[] {
  return [
    {
      action: "语音导出",
      combination: HotkeyCombination(!isMac ? "Ctrl E" : "Meta E"),
    },
    {
      action: "选择并导出声音",
      combination: HotkeyCombination("E"),
    },
    {
      action: "剪辑并导出声音",
      combination: HotkeyCombination(""),
    },
    {
      action: "播放/停止",
      combination: HotkeyCombination("Space"),
    },
    {
      action: "连续播放/停止",
      combination: HotkeyCombination("Shift Space"),
    },
    {
      action: "显示重音栏",
      combination: HotkeyCombination("1"),
    },
    {
      action: "显示语调字段",
      combination: HotkeyCombination("2"),
    },
    {
      action: "显示长度栏",
      combination: HotkeyCombination("3"),
    },
    {
      action: "添加文本栏",
      combination: HotkeyCombination("Shift Enter"),
    },
    {
      action: "复制文本字段",
      combination: HotkeyCombination(!isMac ? "Ctrl D" : "Meta D"),
    },
    {
      action: "删除文本字段",
      combination: HotkeyCombination("Shift Delete"),
    },
    {
      action: "从文本字段移出焦点",
      combination: HotkeyCombination("Escape"),
    },
    {
      action: "重新聚焦文本字段",
      combination: HotkeyCombination("Enter"),
    },
    {
      action: "恢复",
      combination: HotkeyCombination(!isMac ? "Ctrl Z" : "Meta Z"),
    },
    {
      action: "重新开始",
      combination: HotkeyCombination(!isMac ? "Ctrl Y" : "Shift Meta Z"),
    },
    {
      action: "放大",
      combination: HotkeyCombination(""),
    },
    {
      action: "缩小",
      combination: HotkeyCombination(""),
    },
    {
      action: "重置放大率",
      combination: HotkeyCombination(""),
    },
    {
      action: "新项目",
      combination: HotkeyCombination(!isMac ? "Ctrl N" : "Meta N"),
    },
    {
      action: "全屏显示",
      combination: HotkeyCombination(!isMac ? "F11" : "Ctrl Meta F"),
    },
    {
      action: "保存并覆盖项目",
      combination: HotkeyCombination(!isMac ? "Ctrl S" : "Meta S"),
    },
    {
      action: "命名并保存项目",
      combination: HotkeyCombination(!isMac ? "Ctrl Shift S" : "Shift Meta S"),
    },
    {
      action: "保存项目副本",
      combination: HotkeyCombination(!isMac ? "Ctrl Alt S" : "Alt Meta S"),
    },
    {
      action: "加载项目",
      combination: HotkeyCombination(!isMac ? "Ctrl O" : "Meta O"),
    },
    {
      action: "加载文本",
      combination: HotkeyCombination(""),
    },
    {
      action: "重置语调",
      combination: HotkeyCombination(!isMac ? "Ctrl G" : "Meta G"),
    },
    {
      action: "重置所选重音短语语调",
      combination: HotkeyCombination("R"),
    },
    {
      action: "复制",
      combination: HotkeyCombination(!isMac ? "Ctrl C" : "Meta C"),
    },
    {
      action: "剪切",
      combination: HotkeyCombination(!isMac ? "Ctrl X" : "Meta X"),
    },
    {
      action: "粘贴",
      combination: HotkeyCombination(!isMac ? "Ctrl V" : "Meta V"),
    },
    {
      action: "全选",
      combination: HotkeyCombination(!isMac ? "Ctrl A" : "Meta A"),
    },
    {
      action: "取消选择",
      combination: HotkeyCombination("Escape"),
    },
    ...Array.from({ length: 10 }, (_, index) => {
      const roleKey = index == 9 ? 0 : index + 1;
      return {
        action:
          `${index + 1}${actionPostfixSelectNthCharacter}` as HotkeyActionNameType,
        combination: HotkeyCombination(
          `${!isMac ? "Ctrl" : "Meta"} ${roleKey}`,
        ),
      };
    }),
  ];
}
