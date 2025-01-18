<script setup>
import { generalIcons } from '@/assets/svg';
import { WAGER_STATUS } from '@/pages/constants';

const props = defineProps({
    outcomeOption: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    editable: { type: Boolean, default: true },
    rightField: { type: Object, default: null }, // { label: string, value: string}
    leftField: { type: Object, default: null }, // { label: string, value: string}
});

defineEmits(['select']);

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
    if (props.outcomeOption.wagerStatus && props.outcomeOption.wagerStatus in iconVariants) {
        return iconVariants[props.outcomeOption.wagerStatus][locale.value];
    }
    return null;
});
</script>

<template>
  <div
    v-if="outcomeOption"
    class="event-outcome-option"
    :class="{ 'selected': selected, 'uneditable': !editable }"
    @click="$emit('select', outcomeOption)"
  >
    <div class="flex gap-2 align-items-center flex-1">
      <div class="option-icon">
        {{ outcomeOption.value }}
      </div>
      <div>
        <div>
          {{ outcomeOption.title }}
        </div>
        <div class="flex gap-2">
          <div v-if="leftField">
            <span class="text-xs">
              {{ leftField.label }}:
            </span>
            <span class="data-value">
              {{ leftField.value }}
            </span>
          </div>
          <div v-if="rightField">
            <span class="text-xs">
              {{ rightField.label }}:
            </span>
            <span class="data-value ml-2">
              {{ rightField.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <Checkbox v-if="editable" :model-value="selected" binary class="pointer-events-none" />
    <div v-else-if="statusIcon">
      <img :src="statusIcon" alt="result icon" width="30" height="30">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.event-outcome-option {
  display: flex;
  gap: .75rem;
  background-color: #fff;
  padding: .5rem .75rem;
  align-items: center;

  &.selected {
    box-shadow: inset 0 0 0 2px var(--red-500);
  }

  &.uneditable {
    background-color: var(--primary-500);
    color: #fff;

    .data-value {
      color: var(--yellow-500);
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

  .data-value {
    font-weight: 700;
    color: var(--red-500);
  }
}
</style>
