<script setup>
import { getRelatedEvents } from './useRelatedEvents';
import useBetting from './useBetting';
import useBettingResult from './useBettingResult';
import Ticket from '@/components/Common/Ticket.vue';
import CircleProgress from '@/components/Common/CircleProgress.vue';
import EventCountdown from '@/components/EventCountdown.vue';
import GradientButtonNext from '@/components/Common/GradientButtonNext.vue';
import TransparentButton from '@/components/Common/TransparentButton.vue';
import IconPortfolio from '@/assets/svg/EX-Icon-Portfolio.svg';
import { DURATION_MODE } from '@/utils/formatters';

const { getEventDetail } = useApi();
const {
    eventId,
    title,
    debuggingInfo,
    outcome,
} = useBettingResult();

const {
    bettingInfo,
} = useBetting();

if (!outcome.value) {
    navigateTo('/');
}

const { data: event } = await getEventDetail(eventId);
const relatedEvents = await getRelatedEvents(eventId);

</script>

<template>
  <div class="bg-page-background">
    <div class="text-center text-white uppercase font-1375 font-bold mb-100 pt-3" v-html="title" />

    <Ticket class="mx-100 px-50 py-50">
      <div class="font-bold mt-25 px-50 font-9375">
        {{ event.name }}
      </div>
      <div class="input-group-separator my-75" />

      <div class="flex justify-content-between gap-2 px-1">
        <div>
          <div class="font-9375 font-bold flex align-items-center">
            {{ outcome.name }}
          </div>
          <div class="flex justify-content-start align-items-stretch gap-2 mt-2">
            <div class="font-bold font-9375 bg-k1-500 text-white px-2 py-1 inline-block border-radius-6px">
              {{ formatAmount(bettingInfo.pledge) }}
            </div>
            <div v-if="bettingInfo.leverage" class="font-75 font-bold gap-1 bg-m1-500 text-white px-2 py-1 inline-flex align-items-center flex-stretch-1 border-radius-6px">
              <img src="/images/v1.5/icon-leverage-x.png" width="10">
              {{ formatNumber(+bettingInfo.leverage, 1) }}
            </div>
            <div class="font-bold font-9375 flex align-items-center gap-1 mx-1">
              <img src="/images/v1.5/icon-clock.png" width="12" class="tint-m3-500-filter opacity-50">
              <span class="text-m3-500 opacity-50 font-75">{{ $t('betting_result.just_now') }}</span>
            </div>
          </div>
        </div>
        <div>
          <CircleProgress
            :progress="parseInt(bettingInfo.newProbability * 100)"
            :length="50"
            :track-length="6"
            tint="#00b3b3"
            text-color="#001a1a"
            track-color="#00808051"
          />
        </div>
      </div>
      <div class="input-group-separator mt-50 mb-75" />
      <div class="flex align-items-center gap-2 px-1 pb-50">
        <span class="font-75 font-bold">{{ $t('betting_result.ends') }}</span>
        <EventCountdown class="tint-m3-500-filter opacity-50 event-countdown" :end-time="event.ends_at" :mode="DURATION_MODE.FULL" />
      </div>
    </Ticket>

    <div class="mx-100">
      <GradientButtonNext
        :label="$t('betting.bet_on_this_event_again')"
        tint="yellow"
        @click="navigateTo(localePath(`/events/${eventId}`))"
      />
      <TransparentButton class="mt-100" @click="navigateTo(localePath('/portfolio'))">
        <template #content>
          <img :src="IconPortfolio" width="16" class="mx-2">
          {{ $t('betting.view_in_portfolio') }}
        </template>
      </TransparentButton>
    </div>

    <div v-if="debuggingInfo" class="text-white text-xs white-space-break-spaces">
      <hr>
      {{ JSON.stringify(debuggingInfo, null, "\t") }}
    </div>

    <div class="uppercase font-bold font-1375 text-center text-white mt-200 mb-100" v-html="$t('betting_result.recommended_events')" />
    <RelatedEvents :events="relatedEvents" />
  </div>
</template>

<style lang="scss" scoped>
section {
  padding: 0 1.25rem;
}

.betting-result {
  .result {
    padding: 1rem;
    background-color: #fff;

    .content {
      min-height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: .75rem 2rem;
      font-size: 1.25rem;
      font-weight: 700;
    }
  }
}

</style>
