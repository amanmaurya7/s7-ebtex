<script setup>
import GradientButtonNext from '@/components/Common/GradientButtonNext.vue';
import TransparentButton from '@/components/Common/TransparentButton.vue';
import ProbabilityChart from '@/components/Event/ProbabilityChart.vue';
import WarningText from '@/components/Common/WarningText.vue';
import useBetting from './useBetting';
import Tooltip from '@/components/Common/Tooltip.vue';

const { t } = useNuxtApp().$i18n;
const { $showToast } = useNuxtApp();

definePageMeta({
    middleware: ['user-auth'],
});

const {
    bettingInfo,
    outcome,
    event,
    quote,
    isConfirmed,
    isSubmitting,
    rawChartData,
    isFetchingChartData,
    onSubmitOrder,
    onClickCancel,
} = useBetting();


onMounted(() => {
    if (!event.value) {
        setTimeout(() => {
            $showToast('error', t('betting.event_not_found'));
        }, 1000);
        navigateTo('/');
    }
});

const shouldShowLeverageWarning = computed(() => {
    return bettingInfo.value.leverage > 1;
});

const hasOldWager = computed(() => {
    return quote.value.before_pledge > 0;
});

const isRolled = computed(() => {
    return hasOldWager.value && ((quote.value.before_leverage > 1 && quote.value.leverage > 1) || bettingInfo.value.leverage === quote.value.leverage);
});

</script>

<template>
  <div v-if="event" class="betting-confirmation">
    <div class="event-name mx-50">
      {{ event.name }}
    </div>
    <div class="event-id">
      <span class="event-id-tag">ID</span>
      <span class="event-id-value">{{ event.code }}</span>
    </div>
    <div class="input-group-separator mt-4" />

    <div class="flex justify-content-between px-100 mt-125 font-size-75">
      <div class="uppercase">
        {{ $t('betting.your_prediction') }}
      </div>
      <div class="uppercase">
        {{ $t('betting.outcome_probability') }}
      </div>
    </div>

    <div class="px-75 mt-100">
      <EventOutcomeSelectV2Option
        :show-green-gradient="true"
        :option="{ ...outcome, expectedProbability: bettingInfo.newProbability * 100 }"
        :selected="true"
        :clickable="false"
        :is-active-position="hasOldWager"
        :rolled="isRolled"
        :tint="bettingInfo.leverage > 1 ? '#ffaa00' : '#ffffff'"
      />
    </div>

    <div v-if="hasOldWager" class="old-wager-section">
      <!-- Old Cash Wager -->
      <div class="px-75 my-75 pb-0">
        <div class="flex px-75 align-items-center">
          <img src="/images/v1.5/icon-cash-m3-a20.png" class="mx-50" width="20" height="20" alt="check">
          <div class="mx-50">
            <div class="font-size-75 uppercase">
              <b>{{ $t('betting.old_cash_pledge') }}</b>
            </div>
            <div class="font-size-125 font-bold text-key">
              {{ formatAmount(quote.before_pledge) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Old Leverage Wager -->
      <div v-if="quote.before_leverage > 1" class="px-75">
        <div class="flex my-50 mx-50 align-items-center">
          <div class="input-group-separator m-0 flex-grow-1" />
          <img src="/images/v1.5/icon-chevron-down.png" width="12" alt="check" class="inline-block tint-m3-500-filter opacity-50 input-group-separator-arrow flex-shrink-0">
          <div class="input-group-separator m-0 flex-grow-1" />
        </div>

        <div class="flex px-75 align-items-center">
          <div class="flex align-items-center">
            <img src="/images/v1.5/icon-leverage-m3-a20.png" class="mx-50" width="20" height="20" alt="check">
            <div class="mx-50">
              <div class="font-size-75 uppercase">
                <b>{{ $t('betting.old_wager_value') }}</b>
              </div>
              <div class="font-size-125 font-bold text-key">
                {{ formatAmount(quote.before_wager) }}
              </div>
            </div>
          </div>
          <div class="flex-grow-1">
            <div class="font-size-75 uppercase text-right">
              {{ $t('betting.old_leverage_used') }}
            </div>
            <div class="font-size-9375 font-bold text-key text-right">
              <span class="font-size-75">X</span>{{ quote.before_leverage }}
            </div>
          </div>
        </div>
      </div>
      <!-- Old Projected Payout -->
      <div class="px-75">
        <div class="flex my-50 mx-50 align-items-center">
          <div class="input-group-separator m-0 flex-grow-1" />
          <img src="/images/v1.5/icon-chevron-down.png" width="12" alt="check" class="inline-block tint-m3-500-filter opacity-50 input-group-separator-arrow flex-shrink-0">
          <div class="input-group-separator m-0 flex-grow-1" />
        </div>
        <div class="flex px-75 align-items-center">
          <div class="flex align-items-center">
            <img src="/images/v1.5/icon-return-m3-a20.png" class="mx-50" width="20" height="20" alt="check">
            <div class="mx-50">
              <div class="font-size-75 uppercase">
                <b>{{ $t('betting.old_payout') }}</b>
              </div>
              <div class="font-size-125 font-bold text-key">
                {{ formatAmount(quote.before_payout) }}
              </div>
            </div>
          </div>
          <div class="flex-grow-1">
            <div class="font-size-75 uppercase text-right">
              {{ $t('betting.old_return') }}
            </div>
            <div class="font-size-9375 text-key font-bold text-right">
              {{ formatSignedPercentage(quote.before_return) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasOldWager" class="new-pledge-added uppercase text-center font-bold">
      <div class="uppercase font-75">
        {{ $t('betting.new_pledge_added') }}
      </div>
      <div class="text-key">
        +{{ formatAmount(quote.pledge) }}
      </div>
    </div>

    <!-- Cash Wager -->
    <div class="px-75 my-75 pb-0">
      <div class="flex px-75 align-items-center">
        <img src="/images/v1.5/icon-bet-cash.png" class="mx-50" width="20" height="20" alt="check">
        <div class="mx-50">
          <div class="font-size-75 uppercase">
            <b>{{ $t('betting.cash_used') }}</b>
          </div>
          <div class="font-size-125 font-bold text-key">
            {{ formatAmount(bettingInfo.pledge) }}
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
    <div v-if="bettingInfo.oldLeverage > 1" class="px-75">
      <div class="flex px-75 align-items-center">
        <div class="flex align-items-center">
          <img src="/images/v1.5/icon-bet-leverage.png" class="mx-50" width="20" height="20" alt="check">
          <div class="mx-50">
            <div class="font-size-75 uppercase">
              <b>{{ $t('betting.leveraged_cash_value') }}</b>
            </div>
            <div class="font-size-125 font-bold text-key">
              {{ formatAmount(bettingInfo.wager) }}
            </div>
          </div>
        </div>
        <div class="flex-grow-1">
          <div class="font-size-75 uppercase text-right">
            {{ $t('betting.leverage_used') }}
          </div>
          <div class="font-size-9375 font-bold text-key text-right">
            <span class="font-size-75">X</span>{{ bettingInfo.leverage }}
          </div>
        </div>
      </div>
      <div class="flex my-50 mx-50 align-items-center">
        <div class="input-group-separator m-0 flex-grow-1" />
        <img src="/images/v1.5/icon-chevron-down.png" width="12" alt="check" class="inline-block tint-m3-500-filter opacity-50 input-group-separator-arrow flex-shrink-0">
        <div class="input-group-separator m-0 flex-grow-1" />
      </div>
    </div>

    <!-- Projected Payout -->
    <div class="px-75">
      <div class="flex px-75 align-items-center">
        <div class="flex align-items-center">
          <img src="/images/v1.5/icon-bet-return.png" class="mx-50" width="20" height="20" alt="check">
          <div class="mx-50">
            <div class="font-size-75 uppercase">
              <b>{{ $t('betting.projected_payout') }}</b>
            </div>
            <div class="font-size-125 font-bold text-key">
              {{ formatAmount(bettingInfo.indicativePayout) }}
            </div>
          </div>
        </div>
        <div class="flex-grow-1">
          <div class="font-size-75 uppercase text-right">
            {{ $t('betting.return') }}
          </div>
          <div class="font-size-9375 text-key font-bold text-right">
            {{ formatSignedPercentage(bettingInfo.indicativeReturn) }}
          </div>
        </div>
      </div>
      <div class="input-group-separator my-75 mx-50" />


      <div v-if="bettingInfo.leverage > 1" class="flex justify-content-between px-50 mt-125 mb-25 font-size-75">
        <Tooltip mode="dark" :tooltip-content="$t('betting.indicative_stop_level_tooltip')">
          <span class="uppercase">
            {{ $t('betting.indicative_stop_level') }}
          </span>
        </Tooltip>
        <div class="indicative-stop-level-tag">
          {{ formatPercentage(bettingInfo.stopProbability * 100, 0) }}
        </div>
      </div>

      <div class="flex justify-content-between px-50 font-size-75 mb-25">
        <Tooltip mode="dark" :tooltip-content="$t('betting.market_impact_tooltip')">
          <span class="uppercase">
            {{ $t('betting.market_impact') }}
          </span>
        </Tooltip>
        <div class="font-bold font-size-75">
          {{ formatSignedPercentage(bettingInfo.marketImpact * 100, 1) }}
        </div>
      </div>
    </div>

    <div class="input-group-separator my-75" />

    <div class="flex justify-content-center align-items-center mt-125 mb-125">
      <span class="font-size-75 font-bold uppercase">{{ $t('betting.time_remaining') }}</span>
      <EventCountdown class="tint-m3-500-filter opacity-50" :end-time="event.ends_at" />
    </div>

    <div v-if="isRolled" class="b-m3-a20 mx-100 py-100 font-75 text-center border-radius-6px">
      <div class="flex align-items-center justify-content-center gap-1">
        <img src="/images/v1.5/icon-rolled-green.png" width="12" height="12">
        <div class="uppercase font-bold">
          {{ $t('betting.creating_a_rolled_bet') }}
        </div>
      </div>
      <div class="mt-100 px-100">
        {{ $t('betting.creating_a_rolled_bet_explanation') }}
      </div>
    </div>

    <div v-if="shouldShowLeverageWarning" class="mb-250 leverage-warning-section">
      <WarningText
        :warning-wording="$t('general.important')"
        :message="$t('betting.this_is_a_leveraged_wager')"
      />
      <Loading v-if="isFetchingChartData" />
      <div v-else-if="rawChartData" class="mx-50 px-100 mt-100 mb-75">
        <ProbabilityChart
          :extrapolated-value-map="{ [outcome._id]: bettingInfo.newProbability * 100 }"
          :data="rawChartData"
          :stop-level="bettingInfo.stopProbability * 100"
          :selected-outcome="outcome"
          chart-focus-color="#008080"
          axis-text-color="#001a1a"
          :show-legend="false"
          :show-trading-volume="false"
        />
        <div class="font-75 text-center px-150" v-html="$t('betting.stop_level_explanation')" />
      </div>
    </div>

    <div v-if="shouldShowLeverageWarning" class="mx-50 px-100 mt-100 mb-75">
      <Checkbox v-model="isConfirmed" binary input-id="is-confirmed" class="mr-3 flex-shrink-0" />
      <label for="is-confirmed" class="font-9375 pl-100 font-bold">{{ $t('betting.i_understand_the_risks') }}</label>
    </div>

    <div class="px-100 mt-150 mb-100">
      <GradientButtonNext
        class="mt-0"
        tint="yellow"
        :label="$t('betting.confirm_bet')"
        :disabled="shouldShowLeverageWarning && !isConfirmed"
        :loading="isSubmitting"
        @click="onSubmitOrder"
      />
    </div>
    <div class="px-100 py-100 bg-w2-500 bt-m3-a20">
      <TransparentButton class="mt-1 tint-m3-500-filter" @click="onClickCancel">
        <template #content>
          <img src="/images/v1.5/icon-chevron-right.png" alt="cancel" width="12" class="mr-2 tint-m3-500-filter rotate-180">
          <span class="text-m3-500">{{ $t('betting.back_to_betting_slip') }}</span>
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
  background-color: var(--m3-a50);
  color: white;
  font-size: .75rem;
  font-weight: bold;
  padding: .1rem .25rem;
  border-radius: 6px;
}

.event-id-value {
  font-size: .75rem;
  font-weight: bold;
  color: var(--m3-a50);
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

.leverage-warning-section {
  border: 1px solid var(--error-500);
  border-radius: 6px;
  margin: 1rem;
  padding: 1.2rem 0 1rem;
  margin-bottom: 2rem;
}

.new-pledge-added {
  border-top: 1px solid var(--k1-500);
  border-bottom: 1px solid var(--k1-500);
  margin: .5rem 1rem;
  padding: .5rem 0;
}

.old-wager-section {
  color: var(--m3-a50) !important;
  & .text-key {
    color: var(--m3-a50) !important;
  }
}
</style>
