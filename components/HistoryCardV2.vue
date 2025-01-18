<script setup>
import Ticket from './Common/Ticket.vue';
import EventCountdown from './EventCountdown.vue';
import CircleProgress from './Common/CircleProgress.vue';
import WagerStatus from './Portfolio/WagerStatus.vue';
import { formatDuration, DURATION_MODE } from '@/utils/formatters';
import moment from 'moment';
import WarningText from './Common/WarningText.vue';
import { EVENT_STATUS, WAGER_STATUS } from '@/pages/constants';

defineProps({
    history: { type: Object, required: true },
});

const isActive = (position) => position.status === 0;
const { locale } = useI18n();
const wageredAtHumanized = (wageredAt) => formatDuration(moment.duration(moment(wageredAt).diff(moment())), locale.value, DURATION_MODE.COMPACT);

const isActiveOrNotWinning = (position) => isActive(position) || position.status !== WAGER_STATUS.WIN;
const hasEnded = (event) => {
    return moment(event.ends_at).isBefore(moment());
};
</script>

<template>
  <Ticket>
    <div class="font-bold mt-25 px-100 py-50 font-9375">
      {{ history.title }}
    </div>
    <div
      v-for="(position, index) in history.positions"
      :key="position.id"
      class="flex justify-content-between"
      @click="navigateTo(localePath(`/wager/${position.id}`))"
    >
      <div class="py-2 border-top-dotted flex-grow-1 px-100" :class="{ 'border-bottom-dotted': index === history.positions.length - 1 }">
        <div class="flex justify-content-start align-items-stretch gap-2 flex-wrap">
          <div class="w-100">
            <span class="font-9375 font-bold flex align-items-center">{{ position.event_outcome.name }}</span>
          </div>
          <div class="font-bold font-9375 bg-k1-500 text-white px-2 py-1 inline-block  inline-flex align-items-center flex-stretch-1 border-radius-6px">
            {{ formatAmount(position.wager) }}
          </div>
          <div v-if="position.leverage" class="font-75 font-bold gap-1 bg-m1-500 text-white px-2 py-1 inline-flex align-items-center flex-stretch-1 border-radius-6px">
            <img src="/images/v1.5/icon-leverage-x.png" width="10">
            {{ formatNumber(position.leverage, 1) }}
          </div>
          <div v-if="history.event_status !== EVENT_STATUS.CLOSED" class="font-bold font-9375 flex align-items-center gap-1 mx-1">
            <img src="/images/v1.5/icon-clock.png" width="12" class="tint-m3-500-filter opacity-50">
            <span class="text-m3-500 opacity-50 font-75 uppercase">{{ wageredAtHumanized(position.wagered_at) }}</span>
          </div>
          <div class="font-bold font-9375 flex align-items-center gap-1 mx-1">
            <WarningText v-if="position.stop_warning" :warning-wording="''" class="text-error-500" :message="$t('general.stop_warning')" />
          </div>
        </div>
      </div>
      <div
        class="flex align-items-center justify-content-center"
        :class="{
          'border-left-dotted': isActiveOrNotWinning(position),
          'border-top-dotted': isActiveOrNotWinning(position),
          'border-bottom-dotted': isActiveOrNotWinning(position) && index === history.positions.length - 1,
          'bl-m4-2px': position.status === WAGER_STATUS.WIN,
          'px-2': isActive(position),
        }"
      >
        <CircleProgress
          v-if="isActive(position)"
          :progress="parseInt(position.probability * 100)"
          :length="50"
          :track-length="6"
          tint="#00b3b3"
          text-color="#001a1a"
          track-color="#00808051"
        />
        <WagerStatus v-else :status="position.status" class="wager-status" />
      </div>
    </div>
    <div class="flex align-items-center gap-2 px-100 py-75">
      <div v-if="history.event_status === EVENT_STATUS.CLOSED" class="font-75 font-bold uppercase">
        {{ $t('betting_result.event_closed') }}
      </div>
      <div v-else class="flex gap-2">
        <span class="font-75 font-bold uppercase">{{ $t( hasEnded(history.event) ? 'betting_result.ended' : 'betting_result.ends') }}</span>
        <EventCountdown :end-time="history.event.ends_at" class="event-countdown" :red-when-about-to-end="true" :mode="DURATION_MODE.FULL" />
      </div>
    </div>
  </Ticket>
</template>

<style lang="scss" scoped>
:deep(.event-countdown .countdown) {
  filter: brightness(0) saturate(100%) invert(30%) sepia(58%) saturate(1607%) hue-rotate(149deg) brightness(101%) contrast(104%);
  opacity: 0.5;
}

.wager-status {
  position: relative;
}

</style>
