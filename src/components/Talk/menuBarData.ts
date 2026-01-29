import { computed } from "vue";
import { Store } from "@/store";
import { useRootMiscSetting } from "@/composables/useRootMiscSetting";
import {
  MaybeComputedMenuBarContent,
  MenuBarContent,
} from "@/components/Menu/MenuBar/menuBarData";

export const useMenuBarData = (store: Store): MaybeComputedMenuBarContent => {
  // 「ファイル」メニュー
  const fileSubMenuData = computed<MenuBarContent["file"]>(() => ({
    audioExport: [
      {
        type: "button",
        label: "语音导出",
        onClick: () => {
          void store.actions.SHOW_GENERATE_AND_SAVE_ALL_AUDIO_DIALOG();
        },
        disableWhenUiLocked: true,
      },
      {
        type: "button",
        label: "选择并导出声音",
        onClick: () => {
          void store.actions.SHOW_GENERATE_AND_SAVE_SELECTED_AUDIO_DIALOG();
        },
        disableWhenUiLocked: true,
      },
      {
        type: "button",
        label: "剪辑并导出声音",
        onClick: () => {
          void store.actions.SHOW_GENERATE_AND_CONNECT_ALL_AUDIO_DIALOG();
        },
        disableWhenUiLocked: true,
      },
    ],
    externalProject: [
      {
        type: "button",
        label: "连接文本并导出",
        onClick: () => {
          void store.actions.SHOW_CONNECT_AND_EXPORT_TEXT_DIALOG();
        },
        disableWhenUiLocked: true,
      },
      {
        type: "button",
        label: "文本加载",
        onClick: () => {
          void store.actions.COMMAND_IMPORT_FROM_FILE({ type: "dialog" });
        },
        disableWhenUiLocked: true,
      },
    ],
  }));

  // 「表示」メニュー
  const [showTextLineNumber, changeShowTextLineNumber] = useRootMiscSetting(
    store,
    "showTextLineNumber",
  );
  const viewSubMenuData = computed<MenuBarContent["view"]>(() => ({
    guide: [
      {
        type: "button",
        label: showTextLineNumber.value ? "隐藏行号" : "显示行号   ",
        onClick: () => {
          changeShowTextLineNumber(!showTextLineNumber.value);
        },
        disableWhenUiLocked: true,
      },
    ],
  }));

  return {
    file: fileSubMenuData,
    view: viewSubMenuData,
  };
};
