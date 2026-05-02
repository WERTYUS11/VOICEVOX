<template>
  <QDialog v-model="dialogOpened">
    <QCard class="q-py-sm q-px-md dialog-card">
      <QCardSection>
        <div class="text-h5">更新通知</div>
        <div class="text-body2 text-grey-8">
          可从官方网站下载最新版本
        </div>
      </QCardSection>

      <QSeparator />

      <QCardSection class="q-py-none scroll scrollable-area">
        <template
          v-for="(info, infoIndex) of props.newUpdateInfos"
          :key="infoIndex"
        >
          <h3>版本 {{ info.version }}</h3>
          <ul>
            <template
              v-for="(item, descriptionIndex) of info.descriptions"
              :key="descriptionIndex"
            >
              <li>{{ item }}</li>
            </template>
          </ul>
        </template>
      </QCardSection>

      <QSeparator />

      <QCardActions>
        <QSpace />
        <QBtn
          padding="xs md"
          label="关闭"
          unelevated
          color="surface"
          textColor="display"
          class="q-mt-sm"
          @click="closeUpdateNotificationDialog()"
        />
        <QBtn
          padding="xs md"
          label="跳过此版本"
          unelevated
          color="surface"
          textColor="display"
          class="q-mt-sm"
          @click="
            emit('skipThisVersionClick', props.latestVersion);
            closeUpdateNotificationDialog();
          "
        />
        <QBtn
          padding="xs md"
          label="打开官网"
          unelevated
          color="primary"
          textColor="display-on-primary"
          class="q-mt-sm"
          @click="
            openOfficialWebsite();
            closeUpdateNotificationDialog();
          "
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import { UpdateInfo } from "@/type/preload";

const dialogOpened = defineModel<boolean>("dialogOpened", { default: false });
const props = defineProps<{
  /** 公開されている最新の版本 */
  latestVersion: string;
  /** 表示するアップデート情報 */
  newUpdateInfos: UpdateInfo[];
}>();
const emit = defineEmits<{
  /** スキップするときに呼ばれる */
  (e: "skipThisVersionClick", version: string): void;
}>();

const closeUpdateNotificationDialog = () => {
  dialogOpened.value = false;
};

const openOfficialWebsite = () => {
  window.open(import.meta.env.VITE_OFFICIAL_WEBSITE_URL, "_blank");
};
</script>

<style scoped lang="scss">
@use "@/styles/colors" as colors;

.dialog-card {
  width: 700px;
  max-width: 80vw;
}

.scrollable-area {
  overflow-y: auto;
  max-height: 50vh;

  :deep() {
    h3 {
      font-size: 1.3rem;
      font-weight: bold;
      margin: 0;
    }
  }
}
</style>
