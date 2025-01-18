<script setup>
import CircleProgress from '@/components/Common/CircleProgress.vue';
import HumanizeTimestamp from '@/components/Common/HumanizeTimestamp.vue';
import WagerStatus from '@/components/Portfolio/WagerStatus.vue';
import { useLayoutStore } from '@/store/layout';

defineEmits(['click']);

const props = defineProps({
    option: {
        type: Object,
        required: true,
    },
    selected: {
        type: Boolean,
        default: false,
        required: false,
    },
    clickable: {
        type: Boolean,
        default: true,
    },
    tint: {
        type: String,
        default: 'white',
    },
    wagerAt: {
        type: String,
        default: '',
    },
    wagerStatusToShow: {
        type: Number,
        default: null,
    },
    showGreenGradient: {
        type: Boolean,
        default: false,
    },
    rolled: {
        type: Boolean,
        default: false,
    },
    isActivePosition: {
        type: Boolean,
        default: false,
    },
    showRolledMessage: {
        type: Boolean,
        default: false,
    },
    hide24hrChange: {
        type: Boolean,
        default: false,
    },
});

const layoutStore = useLayoutStore();
const { siteParams } = storeToRefs(layoutStore);

const classesForOption24hrChange = (option, selected) => {
    if (props.hide24hrChange) {
        return {
            hidden: true,
        };
    }
    const thresholdPercentage = siteParams.value.highlight_outcome_probability_24hr_change_threshold_percentage;
    const formatted24hrChange = parseInt(formatPercentage(100 * option.histories.estimated_probability_24hr_change).replace('%', ''));

    if (formatted24hrChange == 0) {
        return {
            hidden: true,
        };
    }
    
    return {
        'text-k1-500': selected && formatted24hrChange >= thresholdPercentage,
        'text-error-500': selected && formatted24hrChange <= -thresholdPercentage,
        'text-white': !selected || Math.abs(formatted24hrChange) < thresholdPercentage,
        'opacity-20': !selected,
    };
};
</script>

<template>
  <div
    class="event-outcome-select"
    :class="{ 'selected': selected, 'non-clickable': !clickable, 'show-green-gradient': showGreenGradient }"
    @click="$emit('click', option)"
  >
    <div class="outcome-name">
      <div v-if="isActivePosition" class="active-position-indicator" />
      <div class="outcome-id">
        {{ option._id }}
      </div>
      <img
        v-if="selected && !wagerAt"
        src="/images/v1.5/icon-outcome-selected.png"
        width="20"
        height="20"
        alt="check"
      >
      <img
        v-if="rolled"
        src="/images/v1.5/icon-rolled-bet.png"
        width="20"
        height="20"
        alt="check"
      >
      <div class="opacity-100">
        <div>{{ option.title }}</div>
        <HumanizeTimestamp v-if="wagerAt" :timestamp="wagerAt" class="mt-2 opacity-20" />
      </div>
    </div>
    <WagerStatus v-if="wagerStatusToShow" :status="wagerStatusToShow" class="wager-status" />
    <div v-else class="mx-75 my-75 flex align-items-center justify-content-center">  
      <div v-if="option.histories.estimated_probability_24hr_change != 0" class="px-25 font-75 font-bold" :class="classesForOption24hrChange(option, selected)">
        <span class="whitespace-nowrap">
          {{ option.histories.estimated_probability_24hr_change > 0 ? '▴' : '▾' }}
          {{ formatPercentage(100 * Math.abs(option.histories.estimated_probability_24hr_change)) }}
        </span>
      </div>
      <CircleProgress
        :progress="parseInt(option.expectedProbability)"
        :length="50"
        :track-length="6"
        :tint="tint"
      />
    </div>
  </div>
  <div v-if="rolled && showRolledMessage" class="flex justify-content-center align-items-center bg-m1-500 py-50 gap-2 border-radius-6px" style="position: relative; top: -6px;">
    <img src="/images/v1.5/icon-rolled.png" width="12" height="12" alt="check">
    <span class="font-75 font-bold uppercase text-white">{{ $t('betting.multiple_wagers_combined') }}</span>
  </div>
</template>

<style lang="scss" scoped>
.event-outcome-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  &:not(:last-child) {
    border-bottom: 1px solid var(--m3-a20);
  }

  &.selected .outcome-id {
    background-color: white;
    color: var(--black-500);
    opacity: 1;
    border-radius: 3px;
    padding: 0px 2px;
  }

  .outcome-name {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.75rem;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }

  &:not(.selected) .outcome-name > *:not(.opacity-100) {
    opacity: 0.2;
  }

  &.selected {
    background-color: var(--m1-500);
    filter: drop-shadow(0 0px 8px var(--m3-500));
    border-radius: 6px;

    & > * {
      opacity: 1;
    }
  }

  &.non-clickable:hover {
    opacity: 1;
    cursor: default;
  }

  &.non-clickable.selected {
    filter: none;
  }

  .outcome-label {
    padding: 1rem 0.5rem;
    min-height: 3.625rem;
    font-weight: bold;
    color: white;
    border-radius: 10px 0 0px 10px;
    overflow: hidden;
  }

  .outcome-name {
    font-weight: bold;
    text-transform: capitalize;
    color: white;
  }
}

.event-outcome-select-header {
  font-size: 0.75rem;
  color: white;
  text-transform: uppercase;
  padding: 0 0.5rem;
}

.show-green-gradient {
  background: url('/images/v1.5/bg-selected-outcome-gradient.png') no-repeat center center;
  background-size: cover;
}
</style>