<script setup>
import moment from 'moment';
import GradientButtonNext from '@/components/Common/GradientButtonNext.vue';
import ProbabilityChart from '@/components/Event/ProbabilityChart.vue';
import ReturnChart from '@/components/Event/ReturnChart.vue';
import useWager from '../../../composables/pages/useWager';
import TransparentButton from '@/components/Common/TransparentButton.vue';
import BackErrorIcon from '@/assets/svg/EX-Aid-Chevron-left.svg';
import EventCountdownRealtime from '@/components/EventCountdownRealtime.vue';
import Tooltip from '@/components/Common/Tooltip.vue';
import { WAGER_STATUS, EVENT_STATUS } from '@/pages/constants';
import { DURATION_MODE } from '@/utils/formatters';

definePageMeta({
    middleware: ['user-auth'],
});
const { getEventMarketHistory } = useApi();

const {
    wager,
    event,
    outcome,
    loadWager,
} = useWager();

watch([event, outcome], () => {
    if (event.value && outcome.value) {
        getOutcomesProbAndReturnChartData(event, outcome);
    }
});

const isFetchingChartData = ref(false);
const rawChartData = ref(null);
const getOutcomesProbAndReturnChartData = async () => {
    const dataEndDate = moment(wager.value.event.ends_at).isBefore(moment()) ? wager.value.event.ends_at : moment();
    const chartDate = useDateRange(7 * 24, dataEndDate);
    const chartParams = {
        precision: 'hour',
        to: chartDate.to,
        from: chartDate.from,
    };
    const eventId = wager.value?.event_id;
    const targetOutcomeId = wager.value?.event_outcome_id;
    if (!eventId || !targetOutcomeId) {
        return;
    }
    isFetchingChartData.value = true;
    const { data, error } = await getEventMarketHistory(eventId, {
        ...chartParams,
        focused_event_outcome_id: targetOutcomeId,
    });
    if (error.value) {
        isFetchingChartData.value = false;
        return;
    }
    if (!data || data.length === 0) {
        isFetchingChartData.value = false;
        return;
    }
    rawChartData.value = data.value;
    isFetchingChartData.value = false;
};

const { $localePath } = useNuxtApp();
const onCreateAnotherWager = () => {
    navigateTo($localePath(`/events/${event.value._id}`));
};
const onAddMarginPosition = () => {
    navigateTo($localePath(`/events/${event.value._id}?deposit_target_outcome_id=${outcome.value._id}`));
};

const isEventAboutToEnd = computed(() => {
    const now = moment();
    const endTime = moment(event.value.endTime);
    const duration = moment.duration(endTime.diff(now));
    const diffSeconds = duration.asSeconds();
    return diffSeconds >= 0 && diffSeconds <= 86400;
});

loadWager();

</script>

<template>
  <div v-if="event" class="betting-confirmation">
    <div class="event-name mx-50 cursor-pointer" @click="navigateTo($localePath(`/events/${event._id}`))">
      {{ event.name }}
    </div>
    <div class="event-id">
      <span class="event-id-tag">ID</span>
      <span class="event-id-value">{{ event.code }}</span>
    </div>
    <div class="input-group-separator mt-4" />

    <div class="flex justify-content-between px-100 mt-125 font-size-75">
      <div class="uppercase">
        {{ $t('betting.your_bet') }}
      </div>
      <div class="uppercase">
        {{ $t('betting.outcome_probability') }}
      </div>
    </div>

    <div class="px-75 mt-100">
      <EventOutcomeSelectV2Option
        :option="outcome"
        :selected="true"
        :clickable="false"
        :tint="wager.leverage > 1 ? '#ffaa00' : 'white'"
        :wager-at="wager.wagered_at"
        :show-green-gradient="true"
        :wager-status-to-show="wager.status"
        :rolled="wager.fill_count > 1"
      />
    </div>

    <!-- Cash Wager -->
    <div class="px-75 py-75 pb-0">
      <div class="flex px-75 align-items-center">
        <img src="/images/v1.5/icon-bet-cash.png" class="mx-50" width="20" height="20" alt="check">
        <div class="mx-50">
          <div class="font-size-75 uppercase">
            <b>{{ $t('betting.cash_wager') }}</b>
          </div>
          <div class="font-size-125 font-bold text-key">
            {{ formatAmount(wager.pledge) }}
          </div>
        </div>
      </div>
      <div class="flex my-50 mx-50 align-items-center">
        <div class="input-group-separator m-0 flex-grow-1" />
        <img src="/images/v1.5/icon-chevron-down.png" width="12" alt="check" class="inline-block tint-m3-500-filter opacity-50 input-group-separator-arrow flex-shrink-0">
        <div class="input-group-separator m-0 flex-grow-1" />
      </div>
    </div>

    <!-- Leverage Wager -->
    <div v-if="wager.leverage > 1" class="px-75">
      <div class="flex px-75 align-items-center">
        <div class="flex align-items-center">
          <img src="/images/v1.5/icon-bet-leverage.png" class="mx-50" width="20" height="20" alt="check">
          <div class="mx-50">
            <div class="font-size-75 uppercase">
              <Tooltip mode="dark" :tooltip-content="$t('betting.leveraged_wager_tooltip')">
                <b>{{ $t('betting.leveraged_wager') }}</b>
              </Tooltip>
            </div>
            <div class="font-size-125 font-bold text-key">
              {{ formatAmount(wager.wager) }}
            </div>
          </div>
        </div>
        <div class="flex-grow-1 align-self-stretch">
          <div class="font-size-75 uppercase text-right">
            {{ $t('betting.leverage_used') }}
          </div>
          <div class="font-size-9375 font-bold text-key text-right mt-1">
            <span class="font-size-75">X</span>{{ formatNumber(wager.leverage, 1) }}
          </div>
        </div>
      </div>
      <div class="flex my-50 mx-50 align-items-center">
        <div class="input-group-separator m-0 flex-grow-1" />
        <img src="/images/v1.5/icon-chevron-down.png" width="12" alt="check" class="inline-block tint-m3-500-filter opacity-50 input-group-separator-arrow flex-shrink-0">
        <div class="input-group-separator m-0 flex-grow-1" />
      </div>
    </div>

    <!-- Payout -->
    <div class="px-75">
      <div class="flex px-75 align-items-center">
        <div class="flex align-items-center">
          <img src="/images/v1.5/icon-bet-return.png" class="mx-50" width="20" height="20" alt="check">
          <div class="mx-50">
            <Tooltip mode="dark" :tooltip-content="$t('betting.projected_payout_tooltip')">
              <span class="font-size-75 uppercase">
                <b>{{ $t(wager.status === WAGER_STATUS.DEFAULT ? 'betting.projected_payout' : 'betting.realized_payout') }}</b>
              </span>
            </Tooltip>
            <div
              class="font-size-125 font-bold text-key"
              :class="{'text-error-500': wager.isActive ? wager.indicativePayout <= 0 : wager.realizedPayout <= 0}"
            >
              {{ formatAmount(wager.isActive ? wager.indicativePayout : wager.realizedPayout) }}
            </div>
          </div>
        </div>
        <div class="flex-grow-1 align-self-stretch">
          <div class="font-size-75 uppercase text-right">
            {{ $t('betting.return') }}
          </div>
          <div
            class="font-size-9375 text-key font-bold text-right mt-1"
            :class="{'text-error-500': wager.isActive ? wager.indicativeReturn <= 0 : wager.finalIndicativeReturn <= 0}"
          >
            {{ formatSignedPercentage(wager.isActive ? wager.indicativeReturn : wager.finalIndicativeReturn) }}
          </div>
        </div>
      </div>
      <div class="input-group-separator my-75 mx-50" />

      <div v-if="wager.isActive && wager.leverage > 1" class="flex justify-content-between px-50 mt-125 mb-25 font-size-75">
        <div class="uppercase">
          {{ $t('betting.indicative_stop_level') }}
        </div>
        <div class="indicative-stop-level-tag">
          {{ formatPercentage(wager.stopProbability * 100, 0) }}
        </div>
      </div>

      <!-- <div class="flex justify-content-between px-50 font-size-75 mb-25">
        <div class="uppercase">
          {{ $t('betting.time_of_last_wager') }}
        </div>
        <div class="font-bold font-size-75">
          -
        </div>
      </div> -->
    </div>

    <div v-if="wager.isActive" class="input-group-separator my-75" />

    <div v-if="wager.isActive" class="mt-150 bb-m3-a20">
      <Loading v-if="isFetchingChartData" />
      <TabView v-else class="custom-p-tabview">
        <TabPanel>
          <template #header>
            {{ $t('betting.probability_chart') }}
          </template>
          <div v-if="rawChartData" class="px-100 pt-100 bg-w2-500 pb-50">
            <ProbabilityChart
              :data="rawChartData"
              :stop-level="wager.stopProbability * 100"
              :selected-outcome="outcome"
              :fill-stop-level="true"
              chart-focus-color="#008080"
              axis-text-color="#001a1a"
              legend-color="#001a1a"
            />
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            {{ $t('betting.return_chart') }}
          </template>
          <div v-if="rawChartData" class="px-100 pt-100 bg-w2-500 pb-50">
            <ReturnChart
              :data="rawChartData"
              :stop-level="wager.stopProbability * 100"
              :selected-outcome="outcome"
              chart-focus-color="#008080"
              axis-text-color="#001a1a"
              legend-color="#001a1a"
            />
          </div>
        </TabPanel>
      </TabView>
    </div>

    <div v-if="wager.status === WAGER_STATUS.REVERSAL" class="my-4">
      <div class="flex align-items-center justify-content-center text-white tint-m3-500-filter opacity-50">
        <img src="/images/v1.5/icon-clock.png" width="12" height="12" class="mr-2">
        <span class="font-size-75 font-bold uppercase">{{ $t('betting.this_event_ended_early') }}</span>
      </div>
    </div>
    <div v-else-if="wager.isActive" class="mt-125 mb-125">
      <div v-if="wager.stop_warning" class="px-100 pt-125 pb-50 b-m3-a20 mx-100 border-radius-6px mb-125">
        <div class="flex align-items-center gap-1 justify-content-center">
          <img src="/images/v1.5/icon-stop-sign.png" width="12" height="12" class="mr-2">
          <span class="font-size-75 font-bold uppercase">{{ $t('betting.wager_is_approaching_stop_level') }}</span>
        </div>
        <div class="flex align-items-center justify-content-around mt-4">
          <div class="font-size-75 font-bold uppercase">
            <div class="text-center">
              {{ $t('betting.current_probability') }}
            </div>
            <div class="font-size-1875 text-center mt-2">
              {{ formatPercentage(outcome.trader_info.estimated_probability * 100, 2) }}
            </div>
          </div>
          <div class="vertical-separator" style="height: 50px;" />
          <div class="font-size-75 font-bold uppercase">
            <div>
              {{ $t('betting.stop_distance') }}
            </div>
            <div class="font-size-1875 mt-2 text-error-500 text-center">
              {{ formatPercentage(wager.stop_distance * 100, 0) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isEventAboutToEnd" class="flex flex-column gap-1 pb-3 pt-4 b-m3-a20 flex-grow-1 mx-100 border-radius-6px align-items-center justify-content-center">
        <div class="flex align-items-center">
          <img src="/images/v1.5/icon-clock-red.png" width="12" height="12" class="mr-2">
          <span class="font-size-75 font-bold uppercase">{{ $t('betting.time_remaining') }}</span>
        </div>
        <EventCountdownRealtime class="text-error-500" :end-time="event.ends_at" />
      </div>
      <div v-else-if="wager.event_status !== EVENT_STATUS.CLOSED" class="flex align-items-center justify-content-center">
        <span class="font-size-75 font-bold uppercase">{{ $t('betting.time_remaining') }}</span>
        <EventCountdown class="tint-m3-500-filter opacity-50" :end-time="event.ends_at" :mode="DURATION_MODE.FULL" />
      </div>
    </div>

    <div v-if="!wager.isActive" class="mt-100 px-100 mb-200 flex justify-content-center align-items-center tint-m3-500-filter opacity-50">
      <img src="/images/v1.5/icon-clock.png" width="12">
      <span class="font-size-75 font-bold uppercase text-white ml-2">{{ $t('betting.event_has_ended') }}</span>
    </div>

    <div v-if="wager.status === WAGER_STATUS.REVERSAL" class="text-center mt-100 px-100 mb-200 font-75 b-m3-a20 py-150 mx-100 border-radius-6px">
      <div class="font-bold uppercase mb-2">
        {{ $t('betting.what_happened') }}
      </div>
      <div>
        {{ $t('betting.reversal_explanation') }}
      </div>
    </div>

    <div v-if="wager.event_status === EVENT_STATUS.CLOSED" class="text-center mt-200 mb-100 px-100 font-75 uppercase font-bold">
      {{ $t('betting_result.event_closed') }}
    </div>
    <div v-if="wager.isActive" class="px-100 mb-125">
      <GradientButtonNext
        v-if="wager.leverage > 1"
        class="mt-0 mb-4"
        :disabled="wager.event_status === EVENT_STATUS.CLOSED"
        :label="$t('betting.add_margin_position')"
        tint="yellow"
        @click="onAddMarginPosition"
      />
      <GradientButtonNext
        class="mt-0"
        :disabled="wager.event_status === EVENT_STATUS.CLOSED"
        :label="$t('betting.make_another_wager')"
        @click="onCreateAnotherWager"
      />
    </div>

    <div class="auth-secondary-bottom-button py-3">
      <TransparentButton @click="navigateTo($localePath('/portfolio'))">
        <template #content>
          <img :src="BackErrorIcon" width="12" height="12" class="lock-icon tint-m3-500-filter">
          <span class="text-m3-500 ml-2">{{ $t('portfolio.back_to_my_wagers') }}</span>
        </template>
      </TransparentButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
section {
  padding: .75rem .875rem;
}

.event-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 2.75rem;
  text-align: center;
}

.event-id {
  text-align: center;
  margin-top: .75rem;
}

.event-id-tag {
  background-color: var(--m3-a20);
  color: white;
  font-size: .75rem;
  font-weight: bold;
  padding: .1rem .25rem;
  border-radius: 6px;
}

.event-id-value {
  font-size: .75rem;
  font-weight: bold;
  color: var(--m3-a20);
  margin-left: .5rem;
}

.indicative-stop-level-tag {
  border-radius: 3px;
  font-size: .75rem;
  font-weight: bold;
  color: white;
  padding: .1rem .25rem;
  background: var(--error-500);
}

:deep(.event-countdown) {
  display: inline-block;
  filter: brightness(0) saturate(100%) invert(30%) sepia(58%) saturate(1607%) hue-rotate(149deg) brightness(101%) contrast(104%);
  opacity: 0.5;
  margin-left: .5rem;
}

:deep(.sample-prob-line) {
  display: inline-block;
  width: 30px;
  height: 3px;
  background-color: var(--m3-500);
  position: relative;
  top: -2px;
  border-radius: 1.5px;
}

:deep(.sample-stop-line) {
  display: inline-block;
  width: 30px;
  height: 3px;
  background-color: var(--error-500);
  position: relative;
  top: -2px;
  border-radius: 1.5px;
}

.event-outcome-select {
  background: url('/images/v1.5/bg-wager-detail-gradient.png') no-repeat center center;
  background-size: cover;
}

:deep(.custom-p-tabview) {
  .p-tabview-header {
    background: white !important;
    font-size: .75rem;
  }
}
</style>
