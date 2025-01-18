<script setup>
defineProps({
    warningWording: {
        type: String,
        required: false,
        default: null,
    },
    message: {
        type: String,
        required: true,
    },
    messageInBold: {
        type: Boolean,
        default: true,
    },
    messageOnSecondLine: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
  <div class="warning-text font-75 text-center flex align-items-center justify-content-center gap-2 flex-wrap">
    <span class="text-error-500 inline-flex align-items-center font-bold uppercase flex-shrink-0">
      <img class="icon-warning-text" src="/images/v1.5/icon-warning-text.png" width="16">
      {{ warningWording !== null ? warningWording : $t('general.warning') }}
    </span>
    <div v-if="messageOnSecondLine" class="message" :class="{ 'font-bold': messageInBold, 'uppercase': messageInBold }" v-html="message" />
    <span v-else class="message" :class="{ 'font-bold': messageInBold, 'uppercase': messageInBold }" v-html="message" />
  </div>
</template>

<style scoped>
.icon-warning-text {
    position: relative;
    top: -1px;
}
</style>
