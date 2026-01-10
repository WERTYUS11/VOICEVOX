<template>
  <QDialog
    v-model="dialogOpened"
    maximized
    allowFocusOutside
    transitionShow="jump-up"
    transitionHide="jump-down"
    class="setting-dialog transparent-backdrop"
  >
    <QLayout container view="hHh Lpr fFf" class="bg-background">
      <QPageContainer class="root">
        <QHeader class="q-pa-sm">
          <QToolbar>
            <QToolbarTitle class="text-display"
              >设置 / 选项</QToolbarTitle
            >
            <QSpace />
            <!-- close button -->
            <QBtn
              round
              flat
              icon="close"
              color="display"
              aria-label="关闭设置"
              @click="dialogOpened = false"
            />
          </QToolbar>
        </QHeader>
        <QPage>
          <div class="container">
            <BaseScrollArea>
              <!-- Engine Mode Card -->
              <div class="setting-card">
                <div class="title-row">
                  <h5 class="headline">引擎</h5>
                  <template v-if="engineIds.length > 1">
                    <BaseSelect v-model="selectedEngineId">
                      <BaseSelectItem
                        v-for="engineId in engineIds"
                        :key="engineId"
                        :value="engineId"
                        :label="renderEngineNameLabel(engineId)"
                      />
                    </BaseSelect>
                  </template>
                </div>
                <BaseTooltip
                  :label="
                    engineInfos[selectedEngineId].name +
                    'CPU 版本的VOICEVOX无法使用 GPU 模式。'
                  "
                  :disabled="gpuSwitchEnabled(selectedEngineId)"
                >
                  <ButtonToggleCell
                    title="引擎模式"
                    description="使用 GPU 模式需要 GPU。Linux 仅支持 NVIDIA™ GPU。"
                    :options="engineUseGpuOptions"
                    :disable="!gpuSwitchEnabled(selectedEngineId)"
                    :modelValue="selectedEngineUseGpu ? 'GPU' : 'CPU'"
                    @update:modelValue="
                      (mode) => (selectedEngineUseGpu = mode === 'GPU')
                    "
                  />
                </BaseTooltip>
                <SelectCell
                  title="音频采样率"
                  description="可更改播放和保存时的音频采样率（提高采样率并不会提高音频质量）。"
                  :modelValue="outputSamplingRate.toString()"
                  :options="
                    samplingRateOptions.map((option) => {
                      return {
                        value: option.toString(),
                        label: renderSamplingRateLabel(option),
                      };
                    })
                  "
                  @update:modelValue="
                    (value) =>
                      (outputSamplingRate = Number(value) || 'engineDefault')
                  "
                />
              </div>
              <!-- Preservation Setting -->
              <div class="setting-card">
                <h5 class="headline">操作</h5>
                <ToggleCell
                  title="预设功能"
                  description="开启时，启用预设功能。可以注册和应用参数。"
                  :modelValue="enablePreset"
                  @update:modelValue="changeEnablePreset"
                />
                <QSlideTransition>
                  <!-- q-slide-transitionはheightだけをアニメーションするのでdivで囲う -->
                  <div v-show="enablePreset" class="transition-container">
                    <ToggleCell
                      title="更改样式时应用默认预设"
                      description="开启时，在更改角色或样式时会自动应用默认预设。"
                      class="in-slide-transition-workaround"
                      :modelValue="shouldApplyDefaultPresetOnVoiceChanged"
                      @update:modelValue="
                        changeShouldApplyDefaultPresetOnVoiceChanged($event)
                      "
                    />
                  </div>
                </QSlideTransition>
                <ToggleCell
                  title="参数继承"
                  description="开启时，在添加文本框时，会继承当前语速等参数。"
                  :modelValue="inheritAudioInfoMode"
                  @update:modelValue="changeinheritAudioInfo"
                />
                <ButtonToggleCell
                  v-model="activePointScrollMode"
                  title="跟随播放位置"
                  description="可选择音频播放时，详细调整区域的自动滚动模式。"
                  :options="[
                    {
                      label: '连续',
                      value: 'CONTINUOUSLY',
                      description: '将当前播放位置显示在中间。',
                    },
                    {
                      label: '翻页',
                      value: 'PAGE',
                      description:
                        '当当前播放位置超出显示范围时滚动。',
                    },
                    {
                      label: '关闭',
                      value: 'OFF',
                      description: '禁止自动滚动',
                    },
                  ]"
                />
                <ButtonToggleCell
                  title="文本自动分割"
                  description="可选择粘贴文本时文本的分割位置。"
                  :modelValue="splitTextWhenPaste"
                  :options="[
                    {
                      label: '句号和换行符',
                      value: 'PERIOD_AND_NEW_LINE',
                      description: '根据句号和换行符分割文本。',
                    },
                    {
                      label: '改行',
                      value: 'NEW_LINE',
                      description: '仅根据换行符分割文本。',
                    },
                    {
                      label: '关闭',
                      value: 'OFF',
                      description: '不进行分割。',
                    },
                  ]"
                  @update:modelValue="
                    changeSplitTextWhenPaste(
                      $event as RootMiscSettingType['splitTextWhenPaste'],
                    )
                  "
                />
                <ToggleCell
                  title="备忘录功能"
                  description="开启时，可以通过将文本用 [] 括起来，在文本中写入备忘录。"
                  :modelValue="enableMemoNotation"
                  @update:modelValue="changeEnableMemoNotation"
                />
                <ToggleCell
                  title="注音功能"
                  description="开启时，通过在文本中写入 {注音对象|读法}，可以改变文本的读法。"
                  :modelValue="enableRubyNotation"
                  @update:modelValue="changeEnableRubyNotation"
                />
                <BaseRowCard
                  title="重新显示所有已隐藏的提示"
                  description="可以重新显示所有过去已隐藏的提示。"
                >
                  <BaseButton
                    label="重新显示"
                    :disabled="isDefaultConfirmedTips"
                    @click="
                      () => {
                        store.actions.RESET_CONFIRMED_TIPS();
                        hasResetConfirmedTips = true;
                      }
                    "
                  />
                </BaseRowCard>
                <ToggleCell
                  title="多选"
                  description="开启时，可以同时选择多个文本框。"
                  :modelValue="enableMultiSelect"
                  @update:modelValue="setEnableMultiSelect($event)"
                />
              </div>
              <!-- Saving Card -->
              <div class="setting-card">
                <h5 class="headline">保存</h5>
                <ToggleCell
                  title="固定导出目标"
                  description="开启时，可以预先指定导出时的文件夹。"
                  :modelValue="savingSetting.fixedExportEnabled"
                  @update:modelValue="
                    handleSavingSettingChange('fixedExportEnabled', $event)
                  "
                >
                </ToggleCell>
                <QSlideTransition>
                  <!-- q-slide-transitionはheightだけをアニメーションするのでdivで囲う -->
                  <div
                    v-show="savingSetting.fixedExportEnabled"
                    class="transition-container"
                  >
                    <BaseRowCard title="导出目标文件夹">
                      {{ savingSetting.fixedExportDir }}
                      <BaseButton
                        icon="folder_open"
                        label="选择文件夹"
                        @click="selectFixedExportDir()"
                      >
                      </BaseButton>
                    </BaseRowCard>
                  </div>
                </QSlideTransition>

                <FileNameTemplateDialog
                  v-model:dialogOpened="showAudioFilePatternEditDialog"
                  :savedTemplate="audioFileNamePattern"
                  :defaultTemplate="DEFAULT_AUDIO_FILE_NAME_TEMPLATE"
                  :availableTags="[
                    'index',
                    'characterName',
                    'styleName',
                    'text',
                    'date',
                    'projectName',
                  ]"
                  :fileNameBuilder="buildAudioFileNameFromRawData"
                  extension=".wav"
                  @update:template="
                    handleSavingSettingChange('fileNamePattern', $event)
                  "
                />
                <FileNameTemplateDialog
                  v-model:dialogOpened="showSongTrackAudioFilePatternEditDialog"
                  :savedTemplate="songTrackFileNamePattern"
                  :defaultTemplate="DEFAULT_SONG_AUDIO_FILE_NAME_TEMPLATE"
                  :availableTags="[
                    'index',
                    'characterName',
                    'styleName',
                    'trackName',
                    'date',
                    'projectName',
                  ]"
                  :fileNameBuilder="buildSongTrackAudioFileNameFromRawData"
                  extension=".wav"
                  @update:template="
                    handleSavingSettingChange(
                      'songTrackFileNamePattern',
                      $event,
                    )
                  "
                />

                <EditButtonCell
                  title="语音：导出文件名模式"
                  description="可自定义导出时的文件名模式。"
                  :currentValue="audioFileNamePatternWithExt"
                  @buttonClick="showAudioFilePatternEditDialog = true"
                />

                <ToggleCell
                  title="防止覆盖"
                  description="开启时，如果导出时已存在同名文件，将会在文件名后添加序列号以另存为。"
                  :modelValue="savingSetting.avoidOverwrite"
                  @update:modelValue="
                    handleSavingSettingChange('avoidOverwrite', $event)
                  "
                />
                <ButtonToggleCell
                  title="字符编码"
                  description="选择导出文本文件时的字符编码(请注意：Shift_JIS仅限于日语字符，若无特殊要求请选择UTF-8)"
                  :modelValue="savingSetting.fileEncoding"
                  :options="[
                    { label: 'UTF-8', value: 'UTF-8' },
                    { label: 'Shift_JIS', value: 'Shift_JIS' },
                  ]"
                  @update:modelValue="
                    handleSavingSettingChange('fileEncoding', $event as string)
                  "
                />
                <ToggleCell
                  title="导出 txt 文件"
                  description="开启时，在导出音频时，文本将作为 txt 文件导出。"
                  :modelValue="savingSetting.exportText"
                  @update:modelValue="
                    handleSavingSettingChange('exportText', $event)
                  "
                />
                <ToggleCell
                  title="导出 lab 文件"
                  description="开启时，在导出音频时，将导出用于唇形同步的 lab 文件。"
                  :modelValue="savingSetting.exportLab"
                  @update:modelValue="
                    handleSavingSettingChange('exportLab', $event)
                  "
                />

                <EditButtonCell
                  title="歌曲：轨道文件名模式"
                  description="可自定义导出时的文件名模式。"
                  :currentValue="songTrackFileNamePatternWithExt"
                  @buttonClick="showSongTrackAudioFilePatternEditDialog = true"
                />
              </div>
              <!-- Theme Card -->
              <div class="setting-card">
                <h5 class="headline">外观</h5>
                <ButtonToggleCell
                  v-model="currentThemeNameComputed"
                  title="主题"
                  description="可选择编辑器的颜色"
                  :options="availableThemeNameComputed"
                />
                <ButtonToggleCell
                  title="字体"
                  description="可选择编辑器的字体。"
                  :modelValue="editorFont"
                  :options="[
                    { label: '默认', value: 'default' },
                    { label: '系统字体', value: 'os' },
                  ]"
                  @update:modelValue="
                    changeEditorFont($event as EditorFontType)
                  "
                />
                <ToggleCell
                  title="显示行号"
                  description="打开时，行号将显示在文本字段的左侧。"
                  :modelValue="showTextLineNumber"
                  @update:modelValue="changeShowTextLineNumber"
                />
                <ToggleCell
                  title="音声の長さの表示"
                  description="ONの場合、テキスト欄の右側に音声の長さが表示されます。"
                  :modelValue="showAudioLength"
                  @update:modelValue="changeShowAudioLength"
                />
                <ToggleCell
                  title="显示添加文本按钮"
                  description="关闭时，右下角不会显示添加文本按钮。（文本框可通过 Shift + Enter 添加）"
                  :modelValue="showAddAudioItemButton"
                  @update:modelValue="changeShowAddAudioItemButton"
                />
              </div>

              <!-- Advanced Card -->
              <div class="setting-card">
                <h5 class="headline">高级设置</h5>
                <ToggleCell
                  title="多引擎功能"
                  description="开启时，可以利用多个符合 VOICEVOX 标准的引擎。"
                  :modelValue="enableMultiEngine"
                  @update:modelValue="setEnableMultiEngine"
                />
                <ToggleCell
                  title="音频立体声化"
                  description="开启时，音频数据会从单声道转换为立体声后再进行播放和保存。"
                  :modelValue="savingSetting.outputStereo"
                  @update:modelValue="
                    handleSavingSettingChange('outputStereo', $event)
                  "
                />
                <BaseTooltip
                  label="此功能在您的环境中不受支持，因此无法使用。"
                  :disabled="canSetAudioOutputDevice"
                >
                  <SelectCell
                    v-model="currentAudioOutputDeviceComputed"
                    title="播放设备"
                    description="可更改音频播放设备。"
                    :disable="!canSetAudioOutputDevice"
                    :options="
                      availableAudioOutputDevices
                        ? availableAudioOutputDevices.map((option) => {
                            return { value: option.key, label: option.label };
                          })
                        : []
                    "
                  >
                  </SelectCell>
                </BaseTooltip>
                <BaseTooltip
                  :label="enableKatakanaEnglish.tooltip.value"
                  :disabled="
                    enableKatakanaEnglish.availableEngines.value === 'all'
                  "
                >
                  <ToggleCell
                    v-model="enableKatakanaEnglish.enabled.value"
                    title="将未知英文单词转换为片假名读音"
                    description="开启时，如果引擎支持，将未知英文单词转换为片假名读音。"
                  />
                </BaseTooltip>
                <BaseRowCard
                  title="歌曲：撤销轨道操作"
                  description="指定“撤销”功能所针对的轨道操作。"
                >
                  <div class="checkbox-list">
                    <BaseCheckbox
                      v-for="(value, key) in undoableTrackOperations"
                      :key
                      :checked="value"
                      :label="
                        undoableTrackOperationsLabels[
                          key as keyof typeof undoableTrackOperationsLabels
                        ]
                      "
                      @update:checked="
                        (newValue) =>
                          (undoableTrackOperations = {
                            ...undoableTrackOperations,
                            [key]: newValue,
                          })
                      "
                    />
                  </div>
                </BaseRowCard>
              </div>

              <!-- Experimental Card -->
              <div class="setting-card">
                <h5 class="headline">实验性功能</h5>
                <!-- 今後实验性功能を追加する場合はここに追加 -->
                <ToggleCell
                  title="自动调整疑问句"
                  description="开启时，疑问句句尾的音高会自动升高。"
                  :modelValue="experimentalSetting.enableInterrogativeUpspeak"
                  @update:modelValue="
                    changeExperimentalSetting(
                      'enableInterrogativeUpspeak',
                      $event,
                    )
                  "
                />
                <ToggleCell
                  title="变形功能"
                  description="开启时，启用变形功能。可以混合两种音频。"
                  :modelValue="experimentalSetting.enableMorphing"
                  @update:modelValue="
                    changeExperimentalSetting('enableMorphing', $event)
                  "
                />
                <ToggleCell
                  v-if="!isProduction"
                  title="[仅开发时功能] 保持调整结果"
                  description="开启时，在文本更改时，会保持相同读音的重音区间内的调整结果。"
                  :modelValue="experimentalSetting.shouldKeepTuningOnTextChange"
                  @update:modelValue="
                    changeExperimentalSetting(
                      'shouldKeepTuningOnTextChange',
                      $event,
                    )
                  "
                />
                <ToggleCell
                  v-if="!isProduction"
                  title="[仅开发时功能] 歌曲：显示参数面板"
                  description="开启时，歌曲编辑器中会显示参数面板。"
                  :modelValue="experimentalSetting.showParameterPanel"
                  @update:modelValue="
                    changeExperimentalSetting('showParameterPanel', $event)
                  "
                />
              </div>
              <div class="setting-card">
                <h5 class="headline">数据收集</h5>
                <ToggleCell
                  title="允许收集软件使用情况数据"
                  description="开启时，会发送各 UI 使用率等数据，以帮助改进 VOICEVOX ，不会发送文本数据或音声数据。"
                  :modelValue="acceptRetrieveTelemetryComputed"
                  @update:modelValue="acceptRetrieveTelemetryComputed = $event"
                />
              </div>
            </BaseScrollArea>
          </div>
        </QPage>
      </QPageContainer>
    </QLayout>
  </QDialog>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import FileNameTemplateDialog from "./FileNameTemplateDialog.vue";
import ToggleCell from "./ToggleCell.vue";
import ButtonToggleCell from "./ButtonToggleCell.vue";
import EditButtonCell from "./EditButtonCell.vue";
import SelectCell from "./SelectCell.vue";
import BaseRowCard from "@/components/Base/BaseRowCard.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseScrollArea from "@/components/Base/BaseScrollArea.vue";
import BaseSelect from "@/components/Base/BaseSelect.vue";
import BaseSelectItem from "@/components/Base/BaseSelectItem.vue";
import BaseCheckbox from "@/components/Base/BaseCheckbox.vue";
import BaseTooltip from "@/components/Base/BaseTooltip.vue";
import { useStore } from "@/store";
import {
  DEFAULT_AUDIO_FILE_NAME_TEMPLATE,
  DEFAULT_SONG_AUDIO_FILE_NAME_TEMPLATE,
  buildAudioFileNameFromRawData,
  buildSongTrackAudioFileNameFromRawData,
} from "@/store/utility";
import {
  SavingSetting,
  EngineSettingType,
  ExperimentalSettingType,
  ActivePointScrollMode,
  RootMiscSettingType,
  EngineId,
  EditorFontType,
} from "@/type/preload";
import { createLogger } from "@/helpers/log";
import { useRootMiscSetting } from "@/composables/useRootMiscSetting";
import { isProduction } from "@/helpers/platform";
import { ExhaustiveError } from "@/type/utility";

type SamplingRateOption = EngineSettingType["outputSamplingRate"];

const dialogOpened = defineModel<boolean>("dialogOpened");

const store = useStore();
const { warn } = createLogger("SettingDialog");

const engineIds = computed(() => store.state.engineIds);
const engineInfos = computed(() => store.state.engineInfos);
const engineManifests = computed(() => store.state.engineManifests);
const inheritAudioInfoMode = computed(() => store.state.inheritAudioInfo);
const activePointScrollMode = computed({
  get: () => store.state.activePointScrollMode,
  set: (activePointScrollMode: ActivePointScrollMode) => {
    void store.actions.SET_ACTIVE_POINT_SCROLL_MODE({
      activePointScrollMode,
    });
  },
});
const experimentalSetting = computed(() => store.state.experimentalSetting);

const handleSavingSettingChange = (
  key: keyof SavingSetting,
  data: string | boolean | number,
) => {
  void store.actions.SET_SAVING_SETTING({
    data: { ...savingSetting.value, [key]: data },
  });
};

// 引擎：引擎模式
const selectedEngineUseGpu = computed({
  get: () => {
    return store.state.engineSettings[selectedEngineId.value].useGpu;
  },
  set: (mode: boolean) => {
    void changeUseGpu(mode);
  },
});

// 引擎：音频采样率
const samplingRateOptions: SamplingRateOption[] = [
  "engineDefault",
  24000,
  44100,
  48000,
  88200,
  96000,
];
const renderSamplingRateLabel = (value: SamplingRateOption): string => {
  if (value === "engineDefault") {
    return "默认";
  } else {
    return `${value / 1000} kHz`;
  }
};
const outputSamplingRate = computed({
  get: () => {
    return store.state.engineSettings[selectedEngineId.value]
      .outputSamplingRate;
  },
  set: async (outputSamplingRate: SamplingRateOption) => {
    if (outputSamplingRate !== "engineDefault") {
      const result = await store.actions.SHOW_CONFIRM_DIALOG({
        title: "要更改输出采样率吗？",
        message:
          "更改输出采样率不会改变音质。此外，音频生成处理可能需要一些时间。",
        actionName: "更改",
      });
      if (result !== "OK") {
        return;
      }
    }

    void store.actions.SET_ENGINE_SETTING({
      engineId: selectedEngineId.value,
      engineSetting: {
        ...store.state.engineSettings[selectedEngineId.value],
        outputSamplingRate,
      },
    });
  },
});

// 非表示にしたヒントの再表示
const hasResetConfirmedTips = ref(false);
const isDefaultConfirmedTips = computed(() => {
  const confirmedTips = store.state.confirmedTips;
  // すべて false (= 初期値) かどうか確認
  return Object.values(confirmedTips).every((v) => !v);
});

// 歌曲：撤销轨道操作
const undoableTrackOperationsLabels = {
  soloAndMute: "静音/独奏",
  panAndGain: "声像/音量",
};
const undoableTrackOperations = computed({
  get: () => store.state.undoableTrackOperations,
  set: (undoableTrackOperations) => {
    void store.actions.SET_ROOT_MISC_SETTING({
      key: "undoableTrackOperations",
      value: undoableTrackOperations,
    });
  },
});

// 外观
const currentThemeNameComputed = computed({
  get: () => store.state.currentTheme,
  set: (currentTheme: string) => {
    void store.actions.SET_CURRENT_THEME_SETTING({ currentTheme });
  },
});

const availableThemeNameComputed = computed(() => {
  return [...store.state.availableThemes]
    .sort((a, b) => a.order - b.order)
    .map((theme) => {
      return { label: theme.displayName, value: theme.name };
    });
});

const [editorFont, changeEditorFont] = useRootMiscSetting(store, "editorFont");

const [enableMultiEngine, setEnableMultiEngine] = useRootMiscSetting(
  store,
  "enableMultiEngine",
);

const [showTextLineNumber, changeShowTextLineNumber] = useRootMiscSetting(
  store,
  "showTextLineNumber",
);

const [showAudioLength, changeShowAudioLength] = useRootMiscSetting(
  store,
  "showAudioLength",
);

const [_enableKatakanaEnglish, setEnableKatakanaEnglish] = useRootMiscSetting(
  store,
  "enableKatakanaEnglish",
);
const enableKatakanaEnglish = {
  enabled: computed({
    get: () => _enableKatakanaEnglish.value,
    set: (enableKatakanaEnglish: boolean) => {
      setEnableKatakanaEnglish(enableKatakanaEnglish);
    },
  }),
  availableEngines: computed(() => {
    const supportedEngines = engineIds.value.filter(
      (engineId) =>
        engineManifests.value[engineId].supportedFeatures.applyKatakanaEnglish,
    );
    if (supportedEngines.length === 0) {
      return "none";
    }
    if (supportedEngines.length === store.state.engineIds.length) {
      return "all";
    }

    return "some";
  }),
  tooltip: computed(() => {
    switch (enableKatakanaEnglish.availableEngines.value) {
      case "none":
        return "没有可使用此功能的引擎。";
      case "some":
        return "部分引擎无法使用此功能。";
      case "all":
        // この場合はツールチップを表示しない
        return "";
      default:
        throw new ExhaustiveError(enableKatakanaEnglish.availableEngines.value);
    }
  }),
};

const [showAddAudioItemButton, changeShowAddAudioItemButton] =
  useRootMiscSetting(store, "showAddAudioItemButton");

const [enableMemoNotation, changeEnableMemoNotation] = useRootMiscSetting(
  store,
  "enableMemoNotation",
);

const [enableRubyNotation, changeEnableRubyNotation] = useRootMiscSetting(
  store,
  "enableRubyNotation",
);

const [enablePreset, _changeEnablePreset] = useRootMiscSetting(
  store,
  "enablePreset",
);

const [
  shouldApplyDefaultPresetOnVoiceChanged,
  changeShouldApplyDefaultPresetOnVoiceChanged,
] = useRootMiscSetting(store, "shouldApplyDefaultPresetOnVoiceChanged");

const [enableMultiSelect, setEnableMultiSelect] = useRootMiscSetting(
  store,
  "enableMultiSelect",
);

const canSetAudioOutputDevice = computed(() => {
  return !!HTMLAudioElement.prototype.setSinkId;
});
const currentAudioOutputDeviceComputed = computed<string | undefined>({
  get: () => {
    // 播放设备が見つからなかったら默认値に戻す
    // FIXME: watchなどにしてgetter内で操作しないようにする
    const device = availableAudioOutputDevices.value?.find(
      (device) => device.key === store.state.savingSetting.audioOutputDevice,
    );
    if (device) {
      return device.key;
    } else if (store.state.savingSetting.audioOutputDevice !== "default") {
      handleSavingSettingChange("audioOutputDevice", "default");
    }
    return undefined;
  },
  set: (device) => {
    if (device) {
      handleSavingSettingChange("audioOutputDevice", device);
    }
  },
});

const availableAudioOutputDevices = ref<{ key: string; label: string }[]>();
const updateAudioOutputDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  availableAudioOutputDevices.value = devices
    .filter((device) => device.kind === "audiooutput")
    .map((device) => {
      return { label: device.label, key: device.deviceId };
    });
};
if (navigator.mediaDevices) {
  navigator.mediaDevices.addEventListener(
    "devicechange",
    updateAudioOutputDevices,
  );
  void updateAudioOutputDevices();
} else {
  warn("navigator.mediaDevices is not available.");
}

const acceptRetrieveTelemetryComputed = computed({
  get: () => store.state.acceptRetrieveTelemetry == "Accepted",
  set: (acceptRetrieveTelemetry: boolean) => {
    void store.actions.SET_ACCEPT_RETRIEVE_TELEMETRY({
      acceptRetrieveTelemetry: acceptRetrieveTelemetry ? "Accepted" : "Refused",
    });

    if (acceptRetrieveTelemetry) {
      return;
    }

    void store.actions.SHOW_ALERT_DIALOG({
      title: "禁用软件使用情况数据收集",
      message:
        "要完全禁用软件使用情况数据收集，需要重新启动 VOICEVOX",
      ok: "OK",
    });
  },
});

const changeUseGpu = async (useGpu: boolean) => {
  await store.actions.CHANGE_USE_GPU({
    useGpu,
    engineId: selectedEngineId.value,
  });
};

const changeinheritAudioInfo = async (inheritAudioInfo: boolean) => {
  if (store.state.inheritAudioInfo === inheritAudioInfo) return;
  void store.actions.SET_INHERIT_AUDIOINFO({ inheritAudioInfo });
};

const changeEnablePreset = (value: boolean) => {
  if (value) {
    // 预设功能をONにしたときは「默认プリセットを自動で適用」もONにする
    _changeEnablePreset(true);
    changeShouldApplyDefaultPresetOnVoiceChanged(true);
  } else {
    _changeEnablePreset(false);
    changeShouldApplyDefaultPresetOnVoiceChanged(false);
  }
};

const changeExperimentalSetting = async (
  key: keyof ExperimentalSettingType,
  data: boolean,
) => {
  void store.actions.SET_EXPERIMENTAL_SETTING({
    experimentalSetting: { ...experimentalSetting.value, [key]: data },
  });
};

const savingSetting = computed(() => store.state.savingSetting);

const engineUseGpuOptions = [
  { label: "CPU", value: "CPU" },
  { label: "GPU", value: "GPU" },
];

const audioFileNamePattern = computed(
  () => store.state.savingSetting.fileNamePattern,
);
const songTrackFileNamePattern = computed(
  () => store.state.savingSetting.songTrackFileNamePattern,
);
const audioFileNamePatternWithExt = computed(() =>
  audioFileNamePattern.value ? audioFileNamePattern.value + ".wav" : "",
);
const songTrackFileNamePatternWithExt = computed(() =>
  songTrackFileNamePattern.value ? songTrackFileNamePattern.value + ".wav" : "",
);

const gpuSwitchEnabled = (engineId: EngineId) => {
  // CPU版でもGPUモードからCPUモードに変更できるようにする
  return (
    store.getters.ENGINE_CAN_USE_GPU(engineId) || selectedEngineUseGpu.value
  );
};

const openFileExplore = () => {
  return window.backend.showSaveDirectoryDialog({
    title: "选择导出目标文件夹",
  });
};

const selectFixedExportDir = async () => {
  const path = await openFileExplore();
  if (path != undefined) {
    handleSavingSettingChange("fixedExportDir", path);
  }
};

// 固定导出目标を有効にしたときに書き出し先が未選択の場合は自動的にダイアログを表示する
watchEffect(async () => {
  if (
    savingSetting.value.fixedExportEnabled &&
    savingSetting.value.fixedExportDir === ""
  ) {
    const path = await openFileExplore();
    if (path != undefined) {
      handleSavingSettingChange("fixedExportDir", path);
    } else {
      // キャンセルした場合書き出し先の固定を無効化する
      handleSavingSettingChange("fixedExportEnabled", false);
    }
  }
});

const [splitTextWhenPaste, changeSplitTextWhenPaste] = useRootMiscSetting(
  store,
  "splitTextWhenPaste",
);

const showAudioFilePatternEditDialog = ref(false);
const showSongTrackAudioFilePatternEditDialog = ref(false);

const selectedEngineIdRaw = ref<EngineId | undefined>(undefined);
const selectedEngineId = computed({
  get: () => {
    return selectedEngineIdRaw.value || engineIds.value[0];
  },
  set: (engineId: EngineId) => {
    selectedEngineIdRaw.value = engineId;
  },
});
const renderEngineNameLabel = (engineId: EngineId) => {
  return engineInfos.value[engineId].name;
};
</script>

<style scoped lang="scss">
@use "@/styles/visually-hidden" as visually-hidden;
@use "@/styles/colors" as colors;
@use "@/styles/v2/colors" as colors-v2;
@use "@/styles/v2/variables" as vars;
@use "@/styles/v2/mixin" as mixin;

.container {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background-color: colors-v2.$background;
}

.headline {
  @include mixin.headline-2;
}

// NOTE: なぜか:globalしないと効かない
:global(.setting-dialog) {
  z-index: vars.$z-index-fullscreen-dialog !important;
}

.setting-card {
  margin: auto;
  max-width: 960px;
  padding: vars.$padding-2;
  display: flex;
  flex-direction: column;
  gap: vars.$gap-1;
}

.setting-dialog .q-layout-container :deep(.absolute-full) {
  right: 0 !important;
  .scroll {
    left: unset !important;
    right: unset !important;
    width: unset !important;
    max-height: unset;
  }
}

.transition-container {
  display: flex;
  flex-direction: column;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: vars.$gap-1;
}

.checkbox-list {
  display: flex;
  gap: vars.$gap-2;
}
</style>
