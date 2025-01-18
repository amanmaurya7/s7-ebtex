<script setup>
import { WAGER_STATUS } from '@/pages/constants';

const { t } = useNuxtApp().$i18n;

const props = defineProps({
    status: { type: Number, required: true },
});

const statusImages = ref({
    [WAGER_STATUS.WIN]: '/images/v1.5/icon-wager-won.png',
    [WAGER_STATUS.LOST]: '/images/v1.5/icon-wager-lost-green.png',
    [WAGER_STATUS.MARGIN_CALL]: '/images/v1.5/icon-wager-stopped-green.png',
    [WAGER_STATUS.REVERSAL]: '/images/v1.5/icon-wager-cancelled-green.png',
});

const statusText = computed(() => {
    return t(`betting_result.status_${props.status}`);
});

const getStatusImage = (status) => {
    return statusImages.value[status];
};
</script>

<template>
  <div
    class="wager-status"
    :class="{ won: status === WAGER_STATUS.WIN }"
    :style="{ opacity: status === WAGER_STATUS.WIN ? 1 : 0.5 }"
  >
    <img
      v-if="status !== WAGER_STATUS.DEFAULT"
      :src="getStatusImage(status)"
      :alt="statusText"
      width="16"
      height="20"
    >
    <div class="font-75 font-bold uppercase mt-2 px-2 text-center" :class="{ 'text-white': status === WAGER_STATUS.WIN, 'text-m3-500': status !== WAGER_STATUS.WIN }">
      {{ statusText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wager-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 80px;

  &.won {
    background: var(--m4-500);
  }
}
</style>
