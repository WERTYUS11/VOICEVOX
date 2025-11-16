import { computed, ref, watch } from "vue";
import { MenuItemData } from "../type";
import { MaybeComputedMenuBarContent } from "./menuBarData";
import { ensureNotNullish } from "@/helpers/errorHelper";
import { useHotkeyManager, HotkeyAction } from "@/plugins/hotkeyPlugin";
import { Store } from "@/store";
import { isProduction } from "@/helpers/platform";

export const useCommonMenuBarData = (store: Store) => {
  const uiLocked = computed(() => store.getters.UI_LOCKED);

  const editor = computed(() => store.state.openedEditor);
  const canUndo = computed(
    () => editor.value && store.getters.CAN_UNDO(editor.value),
  );
  const canRedo = computed(
    () => editor.value && store.getters.CAN_REDO(editor.value),
  );

  const isMultiSelectEnabled = computed(() => store.state.enableMultiSelect);

  const audioKeys = computed(() => store.state.audioKeys);

  const createNewProject = async () => {
    if (!uiLocked.value) {
      await store.actions.CREATE_NEW_PROJECT({});
    }
  };

  const saveProject = async () => {
    if (!uiLocked.value) {
      await store.actions.SAVE_PROJECT_FILE_OVERWRITE();
    }
  };

  const saveProjectAs = async () => {
    if (!uiLocked.value) {
      await store.actions.SAVE_PROJECT_FILE_AS();
    }
  };

  const saveProjectCopy = async () => {
    if (!uiLocked.value) {
      await store.actions.SAVE_PROJECT_FILE_AS_COPY();
    }
  };

  const importProject = () => {
    if (!uiLocked.value) {
      void store.actions.LOAD_PROJECT_FILE({ type: "dialog" });
    }
  };

  /** UIの放大 */
  const zoomIn = async () => {
    await store.actions.ZOOM_IN();
  };

  /** UIの缩小 */
  const zoomOut = async () => {
    await store.actions.ZOOM_OUT();
  };

  /** UIの放大率リセット */
  const zoomReset = async () => {
    await store.actions.ZOOM_RESET();
  };

  const toggleFullScreen = async () => {
    window.backend.toggleFullScreen();
  };

  // 「最近使用的项目」のメニュー
  const recentProjectsSubMenuData = ref<MenuItemData[]>([]);
  const updateRecentProjects = async () => {
    const recentlyUsedProjects =
      await store.actions.GET_RECENTLY_USED_PROJECTS();
    recentProjectsSubMenuData.value =
      recentlyUsedProjects.length === 0
        ? [
            {
              type: "button",
              label: "没有最近使用过的项目",
              onClick: () => {
                // 何もしない
              },
              disabled: true,
              disableWhenUiLocked: false,
            },
          ]
        : recentlyUsedProjects.map((projectFilePath) => ({
            type: "button",
            label: projectFilePath,
            onClick: () => {
              void store.actions.LOAD_PROJECT_FILE({
                type: "path",
                filePath: projectFilePath,
              });
            },
            disableWhenUiLocked: false,
          }));
  };
  const projectFilePath = computed(() => store.state.projectFilePath);
  watch(projectFilePath, updateRecentProjects, {
    immediate: true,
  });

  // TODO: 本来はこのファイルにホットキーの登録を書くべきではないので、どこかに移す。
  const { registerHotkeyWithCleanup } = useHotkeyManager();
  /**
   * 全エディタに対してホットキーを登録する
   * FIXME: hotkeyPlugin側で全エディタに対して登録できるようにする
   */
  function registerHotkeyForAllEditors(action: Omit<HotkeyAction, "editor">) {
    registerHotkeyWithCleanup({
      editor: "talk",
      ...action,
    });
    registerHotkeyWithCleanup({
      editor: "song",
      ...action,
    });
  }

  registerHotkeyForAllEditors({
    callback: createNewProject,
    name: "新项目",
  });
  registerHotkeyForAllEditors({
    callback: saveProject,
    name: "保存并覆盖项目",
  });
  registerHotkeyForAllEditors({
    callback: saveProjectAs,
    name: "命名并保存项目",
  });
  registerHotkeyForAllEditors({
    callback: saveProjectCopy,
    name: "保存项目副本",
  });
  registerHotkeyForAllEditors({
    callback: importProject,
    name: "加载项目",
  });
  registerHotkeyForAllEditors({
    callback: toggleFullScreen,
    name: "全屏显示",
  });
  registerHotkeyForAllEditors({
    callback: zoomIn,
    name: "放大",
  });
  registerHotkeyForAllEditors({
    callback: zoomOut,
    name: "缩小",
  });
  registerHotkeyForAllEditors({
    callback: zoomReset,
    name: "重置放大率",
  });

  return computed<MaybeComputedMenuBarContent>(() => ({
    file: {
      project: [
        {
          type: "button",
          label: "新项目",
          onClick: createNewProject,
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "保存并覆盖项目",
          onClick: async () => {
            await saveProject();
          },
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "命名并保存项目",
          onClick: async () => {
            await saveProjectAs();
          },
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "保存项目副本",
          onClick: async () => {
            await saveProjectCopy();
          },
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "加载项目",
          onClick: () => {
            importProject();
          },
          disableWhenUiLocked: true,
        },
        {
          type: "root",
          label: "最近使用的项目",
          disableWhenUiLocked: true,
          subMenu: recentProjectsSubMenuData.value,
        },
      ],
    },

    edit: {
      undoRedo: [
        {
          type: "button",
          label: "恢复",
          onClick: async () => {
            if (!uiLocked.value) {
              await store.actions.UNDO({
                editor: ensureNotNullish(editor.value),
              });
            }
          },
          disabled: !canUndo.value,
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "重新开始",
          onClick: async () => {
            if (!uiLocked.value) {
              await store.actions.REDO({
                editor: ensureNotNullish(editor.value),
              });
            }
          },
          disabled: !canRedo.value,
          disableWhenUiLocked: true,
        },
        ...(isMultiSelectEnabled.value
          ? [
              {
                type: "button",
                label: "全选",
                onClick: async () => {
                  if (!uiLocked.value && isMultiSelectEnabled.value) {
                    await store.actions.SET_SELECTED_AUDIO_KEYS({
                      audioKeys: audioKeys.value,
                    });
                  }
                },
                disableWhenUiLocked: true,
              } as const,
            ]
          : []),
      ],
    },

    view: {
      window: [
        {
          type: "button",
          label: "全屏显示",
          onClick: toggleFullScreen,
          disableWhenUiLocked: false,
        },
        {
          type: "button",
          label: "放大",
          onClick: () => {
            void zoomIn();
          },
          disableWhenUiLocked: false,
        },
        {
          type: "button",
          label: "缩小",
          onClick: () => {
            void zoomOut();
          },
          disableWhenUiLocked: false,
        },
        {
          type: "button",
          label: "重置放大率",
          onClick: () => {
            void zoomReset();
          },
          disableWhenUiLocked: false,
        },
      ],
    },

    setting: {
      subOptions: [
        {
          type: "button",
          label: "热键分配",
          onClick() {
            void store.actions.SET_DIALOG_OPEN({
              isHotkeySettingDialogOpen: true,
            });
          },
          disableWhenUiLocked: false,
        },
        {
          type: "button",
          label: "自定义工具栏",
          onClick() {
            void store.actions.SET_DIALOG_OPEN({
              isToolbarSettingDialogOpen: true,
            });
          },
          disableWhenUiLocked: false,
        },
        ...(!isProduction
          ? [
              {
                type: "button",
                label: "管理角色和风格",
                onClick() {
                  void store.actions.SET_DIALOG_OPEN({
                    isCharacterListDialogOpen: true,
                  });
                },
                disableWhenUiLocked: true,
              } as const,
            ]
          : []),
        {
          type: "button",
          label: "角色排序/试听",
          onClick() {
            void store.actions.SET_DIALOG_OPEN({
              isOldCharacterOrderDialogOpen: true,
            });
          },
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "默认样式",
          onClick() {
            void store.actions.SET_DIALOG_OPEN({
              isOldDefaultStyleSelectDialogOpen: true,
            });
          },
          disableWhenUiLocked: true,
        },
        {
          type: "button",
          label: "读法和重音词典",
          onClick() {
            void store.actions.SET_DIALOG_OPEN({
              isDictionaryManageDialogOpen: true,
            });
          },
          disableWhenUiLocked: true,
        },
      ],
      options: [
        {
          type: "button",
          label: "选项",
          onClick() {
            void store.actions.SET_DIALOG_OPEN({
              isSettingDialogOpen: true,
            });
          },
          disableWhenUiLocked: false,
        },
      ],
    },
  }));
};
