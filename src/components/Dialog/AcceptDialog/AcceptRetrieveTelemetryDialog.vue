<template>
  <AcceptDialog
    v-model:dialogOpened="dialogOpened"
    title="提升易用性的请求"
    rejectLabel="拒绝"
    acceptLabel="允许"
    heading="隐私政策"
    :terms="privacyPolicy"
    @reject="handler(false)"
    @accept="handler(true)"
  >
    <p>VOICEVOX 正在致力于成为更易用的软件。</p>
    <p>
      在决定按钮布局等方针时，各 UI 的使用率等信息非常重要。如果方便的话，请协助收集软件的使用数据。
    </p>
    <p>
      （我们不会收集输入的文本数据或音频数据，请放心。）
    </p>
  </AcceptDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AcceptDialog from "./AcceptDialog.vue";
import { useStore } from "@/store";

const dialogOpened = defineModel<boolean>("dialogOpened", { default: false });

const store = useStore();

const handler = (acceptRetrieveTelemetry: boolean) => {
  void store.actions.SET_ACCEPT_RETRIEVE_TELEMETRY({
    acceptRetrieveTelemetry: acceptRetrieveTelemetry ? "Accepted" : "Refused",
  });

  dialogOpened.value = false;
};

const privacyPolicy = ref("");
onMounted(async () => {
  privacyPolicy.value = await store.actions.GET_PRIVACY_POLICY_TEXT();
});
</script>
