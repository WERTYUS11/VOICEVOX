<template>
  <QDialog ref="dialogRef" v-model="dialogOpened">
    <QCard class="q-py-sm q-px-md dialog-card">
      <QCardSection>
        <div class="text-h5">音频导出</div>
      </QCardSection>

      <QSeparator />

      <QCardSection>
        <BaseCell
          title="导出方式"
          description="可选择将所有轨道合并导出为一个音频文件，或按轨道分别导出。"
        >
          <QBtnToggle
            v-model="exportTarget"
            :options="exportTargets"
            padding="xs md"
            unelevated
            color="surface"
            textColor="display"
            toggleColor="primary"
            toggleTextColor="display-on-primary"
            dense
          />
        </BaseCell>
        <BaseCell
          title="以单声道导出"
          description="开启时，将禁用声像并合并为单声道导出。"
        >
          <QToggle v-model="isMono" />
        </BaseCell>
        <BaseCell
          title="音频采样率"
          description="音频采样率を変更できます。"
        >
          <QSelect
            v-model="samplingRate"
            dense
            name="samplingRate"
            :options="samplingRateOptions"
            :optionLabel="renderSamplingRateLabel"
          >
          </QSelect>
        </BaseCell>
        <BaseCell
          title="音深"
          description="调整音频位深:16bit兼容高;32bit float高品质"
        >
          <QBtnToggle
            v-model="bitDepth"
            :options="bitDepthOptions"
            noCaps
            padding="xs md"
            unelevated
            color="surface"
            textColor="display"
            toggleColor="primary"
            toggleTextColor="display-on-primary"
            dense
          />
        </BaseCell>
        <BaseCell
          title="限制音量"
          description="开启时，会调整音量以尽量不超过 0dB。"
        >
          <QToggle v-model="withLimiter" />
        </BaseCell>
        <BaseCell
          title="应用的轨道参数"
          description="可选择在导出时应用哪些参数（声像、音量、静音）。"
        >
          <QOptionGroup
            v-model="withTrackParameters"
            type="checkbox"
            inline
            :options="trackParameterOptions"
          />
        </BaseCell>
      </QCardSection>

      <QSeparator />

      <QCardActions>
        <QSpace />
        <QBtn
          unelevated
          align="right"
          label="取消"
          color="toolbar-button"
          textColor="toolbar-button-display"
          class="text-no-wrap text-bold q-mr-sm"
          @click="handleCancel"
        />
        <QBtn
          unelevated
          align="right"
          label="导出"
          color="toolbar-button"
          textColor="toolbar-button-display"
          class="text-no-wrap text-bold q-mr-sm"
          @click="handleExportTrack"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
// NOTE: 前回の設定を引き継ぐため、他のダイアログでやっているようなinitializeValuesはやらない
import { ref, computed } from "vue";
import { useDialogPluginComponent } from "quasar";
import BaseCell from "./BaseCell.vue";
import type { SongExportSetting, TrackParameters } from "@/store/type";
import type { WavFormat } from "@/helpers/fileDataGenerator";

export type ExportTarget = "master" | "stem";
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const dialogOpened = defineModel<boolean>("dialogOpened");
const emit = defineEmits<{
  /** 音声をエクスポートするときに呼ばれる */
  exportAudio: [exportTarget: ExportTarget, setting: SongExportSetting];
}>();

// 导出方式選択
const exportTargets = [
  {
    label: "合并（混音）",
    value: "master",
  },
  {
    label: "按轨道",
    value: "stem",
  },
];
const exportTarget = ref<ExportTarget>("master");

// モノラル
const isMono = ref<boolean>(false);

// サンプルレート
const samplingRate = ref<number>(48000);
const samplingRateOptions = [24000, 44100, 48000, 88200, 96000];
const renderSamplingRateLabel = (rate: number) => `${rate} Hz`;

// ビット深度
const bitDepth = ref<WavFormat>("signedInt16");
const bitDepthOptions = [
  { label: "16bit", value: "signedInt16" },
  { label: "32bit float", value: "float32" },
];

// リミッター
const withLimiter = ref<boolean>(true);

// 声像・音量・ミュート
const withTrackParametersInner = ref<(keyof TrackParameters)[]>([
  "pan",
  "gain",
  "soloAndMute",
]);
const withTrackParameters = computed({
  get: () =>
    isMono.value
      ? withTrackParametersInner.value.filter((v) => v !== "pan")
      : withTrackParametersInner.value,
  set: (value: (keyof TrackParameters)[]) => {
    withTrackParametersInner.value = value;
  },
});
const trackParameterOptions = computed(() => [
  {
    label: "声像",
    value: "pan",
    disable: isMono.value,
  },
  {
    label: "音量",
    value: "gain",
  },
  {
    label: "独奏 / 静音",
    value: "soloAndMute",
  },
]);

const handleExportTrack = () => {
  onDialogOK();
  emit("exportAudio", exportTarget.value, {
    isMono: isMono.value,
    sampleRate: samplingRate.value,
    format: bitDepth.value,
    withLimiter: withLimiter.value,
    withTrackParameters: {
      pan: withTrackParameters.value.includes("pan"),
      gain: withTrackParameters.value.includes("gain"),
      soloAndMute: withTrackParameters.value.includes("soloAndMute"),
    },
  });
};

// 取消ボタンクリック時
const handleCancel = () => {
  onDialogCancel();
  dialogOpened.value = false;
};
</script>

<style scoped lang="scss">
.dialog-card {
  width: 700px;
  max-width: 80vw;
}

.scrollable-area {
  overflow-y: auto;
  max-height: calc(100vh - 100px - 295px);
}
</style>
