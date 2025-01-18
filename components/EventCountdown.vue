<script setup>
import moment from 'moment';
import { NA } from '@/pages/constants';
import { formatDuration, DURATION_MODE } from '@/utils/formatters';

const props = defineProps({
    isEventResolved: { type: Boolean, required: false },
    endTime: { type: String, required: true },
    size: { type: String, required: false, default: 'small' }, // small | large
    redWhenAboutToEnd: { type: Boolean, required: false, default: false },
    mode: {
        type: String,
        required: false,
        default: DURATION_MODE.COMPACT, // compact | full
    },
});

const { t, locale } = useI18n();
const hasValidEndTime = computed(() => !!props.endTime && props.endTime !== NA);
const countdownString = ref('');
const updateCountdownString = () => {
    if (!hasValidEndTime.value) {
        countdownString.value = '';
        return;
    }

    const now = moment();
    const endTime = moment(props.endTime);
    const duration = moment.duration(now.diff(endTime));

    countdownString.value  = formatDuration(duration, locale.value, props.mode);

    if(duration.milliseconds() > 0) {
        countdownString.value = t('general.some_time_ago', {
            time: countdownString.value,
        });
        return;
    }

};

const isAboutToEnd = computed(() => {
    const now = moment();
    const endTime = moment(props.endTime);
    const duration = moment.duration(endTime.diff(now));
    return duration.days() >= 0 && duration.days() <= 1;
});

let timerToken = null;
onMounted(() => {
    timerToken = setInterval(() => {
        updateCountdownString();
    }, 1000);
    updateCountdownString();
});

onUnmounted(() => clearInterval(timerToken));
</script>

<template>
  <client-only>
    <div v-if="hasValidEndTime" class="event-countdown" :class="{ 'event-countdown-sm': size === 'small', 'event-countdown-lg': size === 'large' }">
      <p class="countdown" :class="{ 'about-to-end': redWhenAboutToEnd && isAboutToEnd }">
        <img :src="isAboutToEnd ? '/images/v1.5/icon-clock-red.png' : '/images/v1.5/icon-clock.png'" width="12" class="mr-1">
        <span>{{ countdownString }}</span>
      </p>
    </div>

    <p v-else>
      {{ NA }}
    </p>
  </client-only>
</template>

<style lang="scss" scoped>
.event-countdown {
  text-transform: uppercase;
  font-size: 0.75rem !important;
  &-sm {
    .icon {
      font-size: 0.875rem;
    }

    .countdown {
      font-size: 0.75rem;
    }
  }

  &-lg {
    .icon {
      font-size: 1rem;
    }

    .countdown {
      font-size: 0.875rem;
    }
  }

  .countdown {
    display: flex;
    align-items: center;
    gap: .13rem;
    font-weight: 500;
    color: white;

    &.about-to-end {
      color: var(--error-500) !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }
}
</style>
