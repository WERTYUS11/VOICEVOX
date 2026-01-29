import { computed } from "vue";
import { useEngineIcons } from "@/composables/useEngineIcons";
import {
  MaybeComputedMenuBarContent,
  MenuBarContent,
} from "@/components/Menu/MenuBar/menuBarData";
import { MenuItemData } from "@/components/Menu/type";
import { Store } from "@/store";
import { removeNullableAndBoolean } from "@/helpers/arrayHelper";

export const useElectronMenuBarData = (
  store: Store,
): MaybeComputedMenuBarContent => {
  const engineIds = computed(() => store.state.engineIds);
  const engineInfos = computed(() => store.state.engineInfos);
  const engineManifests = computed(() => store.state.engineManifests);
  const engineIcons = useEngineIcons(engineManifests);
  const enableMultiEngine = computed(() => store.state.enableMultiEngine);

  const hasDownloadVvppEngine = computed(() => {
    return Object.values(engineInfos.value).some((engineInfo) => {
      const manifest = engineInfos.value[engineInfo.uuid];
      return manifest.type === "downloadVvpp";
    });
  });

  // 「エンジン」メニューのエンジン毎の項目
  const engineSubMenuData = computed<MenuBarContent["engine"]>(() => {
    let singleEngineSubMenuData: MenuItemData[];
    if (Object.values(engineInfos.value).length === 1) {
      singleEngineSubMenuData = [
        {
          type: "button",
          label: "重新启动",
          onClick: () => {
            void store.actions.RESTART_ENGINES({
              engineIds: [engineIds.value[0]],
            });
          },
          disableWhenUiLocked: false,
        },
      ];
    } else {
      singleEngineSubMenuData = store.getters.GET_SORTED_ENGINE_INFOS.map(
        (engineInfo): MenuItemData => ({
          type: "root",
          label: engineInfo.name,
          icon:
            engineManifests.value[engineInfo.uuid] &&
            engineIcons.value[engineInfo.uuid],
          disableWhenUiLocked: false,
          subMenu: removeNullableAndBoolean([
            !engineInfo.isDefault && {
              type: "button",
              label: "打开文件夹",
              onClick: () => {
                void store.actions.OPEN_ENGINE_DIRECTORY({
                  engineId: engineInfo.uuid,
                });
              },
              disableWhenUiLocked: false,
            },
            {
              type: "button",
              label: "重新启动",
              onClick: () => {
                void store.actions.RESTART_ENGINES({
                  engineIds: [engineInfo.uuid],
                });
              },
              disableWhenUiLocked: false,
            },
          ]),
        }),
      );
    }

    const allEnginesSubMenuData = removeNullableAndBoolean<MenuItemData>([
      enableMultiEngine.value && {
        type: "button",
        label: "重启所有引擎",
        onClick: () => {
          void store.actions.RESTART_ENGINES({
            engineIds: engineIds.value,
          });
        },
        disableWhenUiLocked: false,
      },
      enableMultiEngine.value && {
        type: "button",
        label: "引擎管理",
        onClick: () => {
          void store.actions.SET_DIALOG_OPEN({
            isEngineManageDialogOpen: true,
          });
        },
        disableWhenUiLocked: false,
      },
      enableMultiEngine.value &&
        store.state.isMultiEngineOffMode && {
          type: "button",
          label: "开启多引擎后重载",
          onClick() {
            void store.actions.RELOAD_APP({
              isMultiEngineOffMode: false,
            });
          },
          disableWhenUiLocked: false,
          disableWhileReloadingLock: true,
        },
      hasDownloadVvppEngine.value && {
        type: "button",
        label: "エンジンのセットアップ",
        onClick: () => {
          void store.actions.CHECK_EDITED_AND_NOT_SAVE({
            nextAction: "switchToWelcome",
          });
        },
        disableWhenUiLocked: false,
      },
    ]);

    return {
      singleEngine: singleEngineSubMenuData,
      allEngines: allEnginesSubMenuData,
    };
  });

  return {
    engine: engineSubMenuData,
  };
};
