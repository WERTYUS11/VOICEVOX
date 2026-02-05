import { describe, test, expect } from "vitest";
import { concatMenuBarData } from "@/components/Menu/MenuBar/menuBarData";
import type { MenuItemData } from "@/components/Menu/type";

const menuItemData1: MenuItemData = {
  type: "button",
  label: "语音导出",
  onClick: () => {},
  disableWhenUiLocked: true,
};
const menuItemData2: MenuItemData = {
  type: "button",
  label: "选择导出声音",
  onClick: () => {},
  disableWhenUiLocked: true,
};
const menuItemData3: MenuItemData = {
  type: "button",
  label: "导入项目",
  onClick: () => {},
  disableWhenUiLocked: true,
};
describe("concatMenuBarData", () => {
  test("指定MenuItemData", () => {
    expect(
      concatMenuBarData([
        {
          file: {
            audioExport: [menuItemData1],
          },
        },
      ]),
    ).toMatchObject({
      file: [menuItemData1],
    });
  });

  test("输入分隔符", () => {
    expect(
      concatMenuBarData([
        {
          file: {
            audioExport: [menuItemData1],
            externalProject: [menuItemData3],
          },
        },
      ]),
    ).toMatchObject({
      file: [menuItemData1, { type: "separator" }, menuItemData3],
    });
  });

  test("合并跨多个位置的MenuItemData", () => {
    expect(
      concatMenuBarData([
        {
          file: {
            audioExport: [menuItemData1],
          },
        },
        {
          file: {
            audioExport: [menuItemData2],
            externalProject: [menuItemData3],
          },
        },
      ]),
    ).toMatchObject({
      file: [
        menuItemData1,
        menuItemData2,
        { type: "separator" },
        menuItemData3,
      ],
    });
  });
});
