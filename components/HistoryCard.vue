<script setup>
import { generalIcons } from '@/assets/svg';
import { WAGER_STATUS } from '@/pages/constants';
const props = defineProps({
    history: { type: Object, required: true },
});

const isActive = props.history.status === 0;
const { WIN_JP, WIN_EN, LOSS_JP, LOSS_EN } = generalIcons;
const iconVariants = {
    [WAGER_STATUS.WIN]: {
        ja: WIN_JP,
        en: WIN_EN,
    },
    [WAGER_STATUS.LOST]: {
        ja: LOSS_JP,
        en: LOSS_EN,
    },
    [WAGER_STATUS.MARGIN_CALL]: {
        ja: LOSS_JP,
        en: LOSS_EN,
    },
};
const { locale } = useI18n();
const statusIcon = computed(() => {
    if (props.history.status in iconVariants) {
        return iconVariants[props.history.status][locale.value];
    }
    return null;
});
</script>

<template>
  <!-- history.status 0 means ongoing-->
  <div v-if="history" class="history-card" :class="{active: isActive, inactive: !isActive}">
    <div class="flex align-items-center gap-1 justify-content-between">
      <h5>
        {{ history.title }}
      </h5>
      <div v-if="history.leverage > 1" class="leverage">
        {{ round(history.leverage, 1) }}x
      </div>
    </div>

    <div v-if="history.selectedOption" class="flex align-items-center gap-1">
      <span class="option-icon">
        {{ history.selectedOption.value }}
      </span>
      <span>
        {{ history.selectedOption.title }}
      </span>
    </div>

    <div class="flex gap-2 align-items-center flex-wrap">
      <p class="list-item">
        <span class="font-bold">
          {{ $t('dashboard.history.wagered_at') }}
        </span>
        <span>
          {{ history.wageredAt }}
        </span>
      </p>
      <p class="list-item text-gray-600">
        <span>
          {{ $t('dashboard.history.wager') }}
        </span>
        <span>
          {{ $filters.formatAmount(history.wager) }}
        </span>
      </p>
    </div>

    <div class="flex gap-2 align-items-center flex-wrap justify-content">
      <p class="list-item tag">
        <span v-if="isActive">
          {{ $t('dashboard.history.predicted_return', { amount: formatPercentage(history.indicativeReturn) }) }}
        </span>
        <span v-else>
          {{ $t('dashboard.history.realized_return', { amount: formatPercentage(history.realizedReturn) }) }}
        </span>
      </p>
      <div class="flex-grow-1" />
      <div v-if="statusIcon">
        <img :src="statusIcon" alt="result icon" width="30" height="30">
      </div>
    </div>

    <div v-if="history.isRefunded" class="wager-refunded mt-2">
      {{ $t('wager.refunded_without_break_line') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history-card {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  padding: .5rem;
  background-color: #fff;
  border: 1px solid var(--gray-600);
  font-size: .875rem;

  .leverage {
    font-weight: 700;
    padding: 3px 6px;
  }

  &.active {
    background-color: white;
    .leverage {
      color: var(--orange-500);
    }
  }

  &.inactive {
    background-color: #d9d9d9;
    border: 1px solid #666666;
    .leverage {
      color: var(--purple-500);
    }
  }
}

.option-icon {
  border-radius: 100px;
  background-color: var(--orange-500);
  color: var(--yellow-500);
  width: 2rem;
  height: 2rem;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .25rem;
  font-size: 0.75rem;

  &.tag {
    border-radius: 100px;
    border: 1px solid var(--primary-500);
    padding: .25rem .5rem;
    color: var(--primary-500);
  }
}
</style>
