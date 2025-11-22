<template>
  <AcceptDialog
    v-model:dialogOpened="dialogOpened"
    title="关于使用条款的通知"
    rejectLabel="不同意并退出"
    acceptLabel="同意并开始使用"
    heading="使用条款"
    :terms
    @reject="handler(false)"
    @accept="handler(true)"
  >
    <p>
      为了让更多人放心使用 VOICEVOX，请同意使用条款。
    </p>
  </AcceptDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AcceptDialog from "./AcceptDialog.vue";
import { useStore } from "@/store";

const dialogOpened = defineModel<boolean>("dialogOpened", { default: false });

const store = useStore();

const handler = (acceptTerms: boolean) => {
  void store.actions.SET_ACCEPT_TERMS({
    acceptTerms: acceptTerms ? "Accepted" : "Rejected",
  });
  if (!acceptTerms) {
    void store.actions.CHECK_EDITED_AND_NOT_SAVE({
      closeOrReload: "close",
    });
  }

  dialogOpened.value = false;
};

const terms = ref("");
onMounted(async () => {
  terms.value = await store.actions.GET_POLICY_TEXT();
});
</script>
