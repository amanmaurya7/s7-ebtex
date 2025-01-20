<script setup>
import { NEW_BET_MERGE_TYPE } from '@/pages/constants';
import { useWalletStore } from '@/store/wallet';
import { storeToRefs } from 'pinia';
import useEventDetail from '~/composables/pages/useEventDetail';
import { useUserStore } from '@/store/user';
import CategoryIconM5 from '@/assets/svg/EX-Aid-Category-m5.svg';
import CollectionIconM5 from '@/assets/svg/EX-Aid-Collection-m5.svg';
import TagIconM5 from '@/assets/svg/EX-Aid-Tag-m5.svg';
import WarningText from '~/components/Common/WarningText.vue';
import Bubble from '~/components/Common/Bubble.vue';
import GradientButtonNext from '~/components/Common/GradientButtonNext.vue';
import Loading from '@/components/Loading.vue';
import BalanceChangeText from '@/components/Common/BalanceChangeText.vue';
import ProbabilityChart from '@/components/Event/ProbabilityChart.vue';
import ReturnChart from '@/components/Event/ReturnChart.vue';
import CustomSlider from '@/components/Common/CustomSlider.vue';
import VerticalTooltip from '@/components/Common/VerticalTooltip.vue';
import Tooltip from '@/components/Common/Tooltip.vue';

const { balance } = storeToRefs(useWalletStore());
const { userInfo } = storeToRefs(useUserStore());
const { $localePath } = useNuxtApp();

const {
    isFetchingChartData,
    event,
    outcomeOptions,
    selectedOutcome,
    recapBets,
    formData,
    isFetchingDynamicIndicator,
    dynamicIndicator,
    minPledge,
    maxPledge,
    maxLeverage,
    shouldWarnMarketImpactWarning,
    marketImpactWarningText,
    quickPledgeOptions,
    onSubmitBet,
    onQuickPledge,
    currentQuote,
    debuggingInfo,
    rawChartData,
    depositingTargetOutcome,
} = useEventDetail();

const isDepositingToOutcome = computed(() => {
    return !!depositingTargetOutcome.value;
});

const quoteAccordionOpened = ref(false);
const chartAccordionOpened = ref(true);
const activeChartIndex = ref(0);

const navigationItems = computed(() => {
    const items = [];
    if (event.value.category) {
        items.push({
            iconUrl: CategoryIconM5,
            label: event.value.category.name,
            count: event.value.category.num_events || 0,
            url: $localePath(`/explore/categories/${event.value.category.slug}`),
        });
    }
    if (event.value.collections) {
        event.value.collections.forEach((collection) => {
            items.push({
                iconUrl: CollectionIconM5,
                label: collection.name,
                count: collection.num_events || 0,
                url: $localePath(`/explore/collections/${collection.slug}`),
            });
        });
    }
    if (event.value.tags) {
        event.value.tags.forEach((tag) => {
            items.push({
                iconUrl: TagIconM5,
                label: tag.name,
                count: collection.num_events || 0,
                url: $localePath(`/explore/tags/${tag.slug}`),
            });
        });
    }
    return items;
});

const hasActivePosition = computed(() => {
    return Object.values(activePositionOutcomeMap.value).some((v) => v);
});

const activePositionOutcomeMap = computed(() => {
    const map = {};
    event.value.outcomes.forEach((o) => {
        map[o._id] = o.has_wagered;
    });
    return map;
});

const newBetTypeMap = computed(() => {
    const map = {};
    outcomeOptions.value.forEach((o) => {
        if (!currentQuote.value || !o.has_wagered) {
            map[o._id] = NEW_BET_MERGE_TYPE.NEW;
        } else {
            const isUsingLeverage = currentQuote.value.leverage > 1;
            if (isUsingLeverage && o.has_leveraged_wagered) {
                map[o._id] = NEW_BET_MERGE_TYPE.ROLLED;
            } else if (!isUsingLeverage && o.has_cash_wagered) {
                map[o._id] = NEW_BET_MERGE_TYPE.ROLLED;
            } else {
                map[o._id] = NEW_BET_MERGE_TYPE.SPLITTED;
            }
        }
    });
    return map;
});

const onNavigationItemClick = (item) => {
    navigateTo(item.url);
};

const onLeverageChange = (e) => {
    if (formData.leverage > maxLeverage.value) {
        formData.leverage = maxLeverage.value;
    }

    leverageTooltipActive.value = formData.leverage > 1 && maxLeverage.value < 10;
    if (leverageTooltipActive.value) {  
        leverageTooltipRef.value?.show();
    } else {
        leverageTooltipRef.value?.hide();
    }
};

const leverageTooltipRef = ref(null);
const delayMountFilled = ref(false);
onMounted(() => {
    setTimeout(() => {
        delayMountFilled.value = true;
    }, 1000);
});

const leverageTooltipActive = ref(false);
const onLeverageTooltipShow = () => {
    leverageTooltipActive.value = true;
};

const onLeverageTooltipHide = () => {
    leverageTooltipActive.value = false;
};
</script>

<template>
  <div v-if="event" class="event">
    <div class="event-container">
      <section v-if="!isDepositingToOutcome && navigationItems.length > 0" class="navigations">
        <div v-for="(item, i) in navigationItems" :key="i" class="navigation-item" @click="onNavigationItemClick(item)">
          <img class="navigation-item-icon" :src="item.iconUrl" alt="navigation icon">
          <div class="uppercase">
            {{ item.label }}
          </div>
          <Badge :value="item.count" class="p-badge-m5" />
          <div class="flex-grow-1" />
          <img class="navigation-item-chevron" src="/images/v1.5/icon-chevron-right.png" alt="navigation icon">
        </div>
      </section>
      
      <div class="desktop-layout">
        <div class="desktop-left-column">
          <section v-if="!isDepositingToOutcome" class="event-detail">
            <EventCardDetail :event="event" tint-hex="#00b3b3" />
          </section>

          <section class="event-options" :class="{'pt-2': isDepositingToOutcome}">
            <h3 class="event-options-title">
              {{ $t(isDepositingToOutcome ? 'event_detail.deposit_options_title' : 'event_detail.options_title') }}
            </h3>
            <EventOutcomeSelectV2
              v-model="selectedOutcome"
              :show-only-selected-option="isDepositingToOutcome"
              :options="outcomeOptions"
              :active-position-outcome-map="activePositionOutcomeMap"
              :new-bet-type-map="newBetTypeMap"
              :tint-for-selected-option="currentQuote?.leverage > 1 ? '#ffaa00' : '#ffffff'"
            />
          </section>
        </div>

        <div class="desktop-right-column">
          <section v-if="event.status === 'open' && selectedOutcome" class="event-betting">
            <div class="bg-white px-3">
              <div class="font-bold uppercase text-center bet-slipping" style="font-size: 1.375rem;" v-html="$t('event_detail.wager_slip')" />
            </div>

            <div class="betting-form">
              <Bubble class="quick-bet-wrapper">
                <template v-for="(option, i) in quickPledgeOptions" :key="option.value">
                  <div
                    class="quick-bet-option"
                    :class="{
                      'quick-bet-selected': option.value === formData.pledge,
                      'quick-bet-not-selected': option.value !== formData.pledge,
                      disabled: option.disabled,
                      'after-selected': i > 0 && quickPledgeOptions[i - 1].value === formData.pledge,
                      'before-selected': i < quickPledgeOptions.length - 1 && quickPledgeOptions[i + 1].value === formData.pledge,
                    }"
                    @click="onQuickPledge(option)"
                  >
                    {{ option.label }}
                  </div>
                </template>
              </Bubble>

              <div class="input-group wager-input-group px-3">
                <div class="flex align-items-center justify-content-between">
                  <div class="input-label">
                    {{ $t('investment.pledge') }}
                  </div>
                  <div class="input-info uppercase">
                    <span>{{ $t('event_detail.your_cash_bet') }}</span>
                    <span
                      v-if="userInfo && typeof balance === 'number'"
                      class="separator"
                    />
                    <Tooltip v-if="userInfo && typeof balance === 'number'" mode="dark" :tooltip-content="$t('betting.your_cash_bet_tooltip')">
                      <span
                        class="max-wager"
                        v-html="$t('event_detail.max_wager', { max: formatAmount(Math.min(balance, currentQuote?.max_pledge), 2) })"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div class="input-wrapper">
                  <InputNumber
                    v-model="formData.pledge"
                    class="pledge-input"
                    input-id="pledge"
                    :min="minPledge"
                    :max="maxPledge"
                    variant="filled"
                    :disabled="!selectedOutcome"
                    :step="0.1"
                    @focus="$event.target.select()"
                    @keyup.enter="$event.target.blur()"
                  />
                  <Slider
                    v-model="formData.pledge"
                    :min="minPledge"
                    :max="maxPledge"
                    :step="0.1"
                    class="mt-3"
                    :disabled="!selectedOutcome"
                  />
                </div>
              </div>


              <div v-if="!isDepositingToOutcome" class="input-group-separator" />

              <div id="leverage-tooltip" style="margin: -1rem 0;" />

              <div v-if="!isDepositingToOutcome" class="input-group leverage-input-group mt-1 px-3">
                <div class="flex align-items-center justify-content-between">
                  <div class="input-label">
                    {{ $t('investment.leverage') }}
                  </div>
                  <div class="input-info uppercase">
                    <span>{{ $t('event_detail.your_cash_multiplier') }}</span>
                    <span
                      v-if="userInfo && typeof balance === 'number'"
                      class="separator"
                    />

                    <VerticalTooltip
                      v-if="delayMountFilled"
                      ref="leverageTooltipRef"
                      tooltip-teleport-target="#leverage-tooltip"
                      :disabled="!userInfo || typeof balance !== 'number' || maxLeverage >= 10"
                      @show="onLeverageTooltipShow"
                      @hide="onLeverageTooltipHide"
                    >
                      <div>
                        <span
                          v-if="userInfo && typeof balance === 'number' && maxLeverage >= 10"
                          class="max-wager"
                          v-html="$t('event_detail.max_leverage', { max: maxLeverage })"
                        />
                        <span
                          v-else-if="userInfo && typeof balance === 'number'"
                          class="max-wager"
                          :class="{'underline-dotted': !leverageTooltipActive, 'underline-red': leverageTooltipActive}"
                          v-html="$t('event_detail.max_leverage_limited', { max: maxLeverage })"
                        />
                      </div>
                      <template #tooltip>
                        <Bubble class="quick-bet-wrapper">
                          <WarningText
                            class="limited-leverage-warning-text-tooltip"
                            :warning-wording="$t('betting.limited_leverage_available')"
                            :message="$t('betting.limited_leverage_warning')"
                            :message-on-second-line="true"
                            :message-in-bold="false"
                          />
                        </Bubble>
                      </template>
                    </VerticalTooltip>
                  </div>
                </div>

                <div class="input-wrapper">
                  <InputNumber
                    v-model="formData.leverage"
                    class="leverage-input"
                    input-id="leverage"
                    :step="0.1"
                    :max-fraction-digits="1"
                    :min="1"
                    :max="maxLeverage"
                    :disabled="maxLeverage <= 1 || !selectedOutcome"
                    @focus="$event.target.select()"
                    @keyup.enter="$event.target.blur()"
                  />
                  <CustomSlider
                    v-if="maxLeverage > 1"
                    v-model="formData.leverage"
                    class="mt-3"
                    :disabled="maxLeverage <= 1 || !selectedOutcome"
                    :min="1"
                    :max="10"
                    :step="0.1"
                    :max-mark-value="maxLeverage"
                    @change="onLeverageChange"
                  />
                </div>
              </div>

              <div class="input-group-separator" />

              <div class="result">
                <div v-show="isFetchingDynamicIndicator" class="quote_loading_mask">
                  <ProgressSpinner animation-duration=".8s" stroke-width="4" />
                </div>

                <div v-if="dynamicIndicator" class="flex justify-content-center">
                  <template v-for="(item, index) in dynamicIndicator" :key="item.name">
                    <div class="result-field">
                      <Tooltip v-if="item.tooltip" mode="dark" :tooltip-content="item.tooltip">
                        <div class="result-field-label text-center" v-html="item.name" />
                      </Tooltip>
                      <div v-else class="result-field-label text-center" v-html="item.name" />
                      <div class="result-field-value text-center">
                        {{ item.value }}
                      </div>
                      <div v-if="item.percentage !== null" class="result-field-change text-center">
                        {{ item.percentage }}
                      </div>
                    </div>
                    <div v-if="index !== dynamicIndicator.length - 1" class="separator" style="margin: 0 2rem;" />
                  </template>
                </div>
              </div>

              <div class="input-group-separator" />

              <div v-if="shouldWarnMarketImpactWarning" class="market-impact-warning">
                {{ marketImpactWarningText }}
              </div>

              <div v-if="debuggingInfo" class="text-xs white-space-break-spaces">
                <hr>
                {{ JSON.stringify(debuggingInfo, null, "\t") }}
              </div>

              <div v-if="!userInfo">
                <WarningText :message="$t('betting.you_are_not_signed_in')" />
                <GradientButtonNext :label="$t('betting.sign_in_to_proceed')" @click="onSubmitBet" />
                <div class="text-center font-bold mt-3 font-9375">
                  {{ $t('betting.wager_will_be_saved_for_five_minutes') }}
                </div>
              </div>
              <div v-else-if="!userInfo.email_verified" class="text-center">
                <WarningText :message="$t('betting.email_not_verified')" />
                <GradientButtonNext :label="$t('betting.verify_email_to_proceed')" @click="onSubmitBet" />
                <div class="text-center font-bold mt-3 font-9375">
                  {{ $t('betting.wager_will_be_saved_for_five_minutes') }}
                </div>
              </div>
              <div v-else-if="balance - formData.pledge < 0">
                <BalanceChangeText :from="balance" :to="balance - formData.pledge" />
                <WarningText v-if="balance - formData.pledge < 0" class="mt-3" :message="$t('betting.you_dont_have_sufficient_funds')" />
                <GradientButtonNext
                  tint="yellow"
                  :label="$t('betting.make_a_deposit_to_proceed')"
                  :disabled="!selectedOutcome || !currentQuote || isFetchingDynamicIndicator"
                  @click="onSubmitBet"
                />
                <div class="text-center font-bold mt-3 font-9375">
                  {{ $t('betting.wager_will_be_saved_for_five_minutes') }}
                </div>
              </div>
              <div v-else>
                <BalanceChangeText :from="balance" :to="balance - formData.pledge" />
                <GradientButtonNext
                  tint="yellow"
                  :label="$t(selectedOutcome ? 'event_detail.bet' : 'error.please_make_a_selection')"
                  :disabled="!selectedOutcome || !currentQuote || isFetchingDynamicIndicator"
                  @click="onSubmitBet"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="desktop-charts-section">
        <Accordion
          class="charts-accordion"
          expand-icon="pi pi-chevron-down"
          collapse-icon="pi pi-chevron-up"
          :active-index="activeChartIndex"
          @tab-open="chartAccordionOpened = true"
          @tab-close="chartAccordionOpened = false"
        >
          <AccordionTab>
            <template #header>
              <div class="accordion-header">
                {{ $t( chartAccordionOpened ? 'event_detail.hide_bet_statistics' : 'event_detail.show_bet_statistics') }}
              </div>
            </template>
            <TabView>
              <TabPanel>
                <template #header>
                  <span class="chart-title">
                    {{ $t('event_detail.chart_title.outcome_probability') }}
                  </span>
                </template>
                <Loading v-if="isFetchingChartData" class="text-white" style="background-color: var(--black-500);" />
                <div v-else-if="rawChartData" class="bg-black-500">
                  <div class="static-chart-tooltip font-75 px-4 py-3 bb-m3-a20 text-center text-white bg-black-500" v-html="$t(selectedOutcome ? 'event_detail.probability_chart_desc_selected_outcome' : 'event_detail.probability_chart_desc_all_outcomes')" />
                  <ProbabilityChart
                    :key="selectedOutcome?._id"
                    :data="rawChartData"
                    :selected-outcome="selectedOutcome"
                    :stop-level="(currentQuote?.after_stop_probability || 0) * 100"
                    :fill-stop-level="currentQuote?.leverage > 1"
                    :event-outcome-ids="event.outcomes.map((o) => o._id)"
                    now-line-color="white"
                    chart-focus-color="#00e6e6"
                  />
                </div>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <span class="chart-title">
                    {{ $t('event_detail.chart_title.indicative_return') }}
                  </span>
                </template>
                <Loading v-if="isFetchingChartData" class="text-white" style="background-color: var(--black-500);" />
                <div v-else-if="rawChartData" class="bg-black-500">
                  <div class="static-chart-tooltip font-75 px-4 py-3 bb-m3-a20 text-center text-white bg-black-500" v-html="$t(selectedOutcome ? 'event_detail.return_chart_desc_selected_outcome' : 'event_detail.return_chart_desc_all_outcomes')" />
                  <ReturnChart
                    :key="selectedOutcome?._id"
                    :data="rawChartData"
                    :selected-outcome="selectedOutcome"
                    :event-outcome-ids="event.outcomes.map((o) => o._id)"
                  />
                </div>
              </TabPanel>
            </TabView>
          </AccordionTab>
        </Accordion>
      </div>

      <div>
        <Accordion
          v-if="!isDepositingToOutcome"
          class="quotes-accordion"
          expand-icon="pi pi-chevron-down"
          collapse-icon="pi pi-chevron-up"
          @tab-open="quoteAccordionOpened = true"
          @tab-close="quoteAccordionOpened = false"
        >
          <AccordionTab>
            <template #header>
              <div class="accordion-header">
                {{ $t(quoteAccordionOpened ? 'event_detail.hide_bet_recap' : 'event_detail.show_bet_recap') }}
              </div>
            </template>
            <BetRecapTable :bets="recapBets" />
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
section {
  padding: 0 1.25rem;
}

.event {
  background: url('/images/v1.5/bg-event-detail.png') no-repeat center center;
  background-size: cover;
}

.event-detail {
  padding-bottom: 32px;
}

.event-options {

  .event-options-title {
    text-align: center;
    color: white;
    text-transform: uppercase;
    font-size: 1.375rem;
    margin: 0.75rem auto 1.25rem;
  }
}

:deep(.chart) {
    width: 100%;
    height: 100%;
    background-color: var(--m1-500) !important;
    padding: 2rem .5rem !important;
    aspect-ratio: 3 / 2;
  }

.quote_loading_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-betting {
  background: white;
  padding-bottom: 2rem;

  .user-available-balance {
    font-size: 0.75rem;
    border-radius: 100px;
    padding: .25rem .5rem;
  }

  .betting-form {
    margin-top: 0.5rem;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .input-group-separator {
    border-bottom: 2px dotted var(--m3-a20);
    margin-right: -1rem;
    margin-left: -1rem;
  }

  .input-group {
    .input-label {
      font-size: 0.9375rem;
      font-weight: bold;
    }

    .input-wrapper {
      margin-top: .25rem;
      gap: 1rem;
    }

    .input-hints {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--gray-600);
      margin-top: .25rem;
    }
  }

  :deep(.p-inputnumber) {
    .p-inputtext {
        font-weight: bold;
        border-bottom: 2px solid var(--m3-a20);
        border-radius: 0;
        padding: .25rem .5rem 0;
        width: 100%;
        font-size: 1.875rem;
        position: relative;

        &:focus {
          color: var(--k1-500);
          border-bottom: 2px solid var(--k1-500);
        }
    }

    &.pledge-input, &.leverage-input {
      position: relative;
      display: inline-block;
    }

    &.pledge-input .p-inputtext, &.leverage-input .p-inputtext {
      padding-left: 1rem;
      display: inline-block;
    }
    &.pledge-input::after, &.leverage-input::after {
      font-weight: bold;
      font-size: .75rem;
      display: block;
      margin-right: .25rem;
      color: var(--text-color);
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(-50%);
    }
    &.pledge-input::after {
      content: '$';
    }
    &.leverage-input::after {
      content: 'X';
    }
  }
}

.market-impact-warning {
  text-align: center;
  font-weight: bold;;
  color: var(--red-500);
}

////// v1.5

.navigations {
  padding: 0 1rem;
  margin: 0 1rem 1rem;
}
.navigation-item {
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: .75rem;
  font-size: .75rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--m3-a20);
  }

  .navigation-item-icon {
    width: .75rem;
    height: .75rem;
  }

  .navigation-item-chevron {
    width: 10px;
    height: 12px;
  }
}

:deep(.p-accordion-tab) {
  display: flex;
  flex-direction: column-reverse;
}

:deep(.p-accordion-header.p-disabled) {
  opacity: 0.2;
}

:deep(.p-accordion-header-action) {
  text-align: center;
  flex-direction: row !important;
  justify-content: center;
}

.accordion-header {
  font-weight: bold;
  font-size: 0.9375rem;
  padding: 0.25rem;
}

.charts-accordion, .quotes-accordion {
  border-top: 0px solid var(--m3-a20);
  border-bottom: 1px solid var(--m3-a20);
  margin-top: 0rem;
}
:deep(.p-accordion-content) {
  padding: 0;
}

:deep(.highlight-yellow) {
  color: var(--k1-500);
}

.bet-slipping {
  padding: 2rem 0 1rem;
}

.quick-bet-wrapper {
  display: flex;
  justify-content: space-around;
  padding: 1rem 1rem;
  margin: 0rem -1.25rem .25rem;
}

.quick-bet-option {
  font-size: 1.25rem;
  font-weight: bold;
  padding: .5rem 1.25rem;
  cursor: pointer;
  flex-grow: 1;
  text-align: center;

  &.disabled {
    opacity: 0.1;
    cursor: not-allowed;
  }

  &:not(:last-child) {
    border-right: 1px solid var(--m3-a20);
  }

  &.before-selected {
    border-right: none;
  }

  &.after-selected {
    border-left: none;
  }

  &.quick-bet-selected, &:hover {
    color: white;
    background-color: var(--k1-500);
    border-radius: 5px;
    &:not(:last-child) {
      border-right: none;
    }
  }

  &:hover:not(:active):not(.quick-bet-selected) {
    opacity: 0.9;
    color: var(--text-color);
  }
}

.input-info {
  display: flex;
  font-size: 0.75rem;
  color: var(--text-color)
}

.separator {
  width: 1px;
  background: var(--m3-a20);
  margin:0 0.5rem;
  display: inline-block;
}

.result-field {

  .result-field-label {
    font-size: 0.75rem;
    font-weight: bold;
  }
  .result-field-value {
    font-size: 1.85rem;
    font-weight: bold;
  }
  .result-field-change {
    font-size: 0.9375rem;
    color: var(--k1-500);
    font-weight: bold;
  }
}

.chart-title {
  font-size: 0.75rem;
}

:deep(.p-tabview-header-action) {
  padding-bottom: .5rem !important;
  background: transparent !important;
  border-bottom: 2px solid var(--m2-500) !important;
  color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.p-accordion-content) {
  background: transparent !important;
}

:deep(.p-highlight .p-tabview-header-action) {
  color: white !important;
}

:deep(.p-tabview-nav) {
  border: 0px !important;
}

:deep(.p-highlight .p-tabview-header-action) {
  border-bottom: 2px solid white !important;
}

:deep(.p-tabview-header-action:focus) {
  box-shadow: none !important;
}

:deep(.limited-leverage-warning-text-tooltip .message) {
  font-size: 0.9375rem;
}

.static-chart-tooltip {
  position: relative;
}

.static-chart-tooltip::after {
  display: 'block';
  position: absolute;
  width: 10px;
  height: 10px;
  transform: rotate(-45deg);
  background-color: var(--black-500);
  content: '';
  bottom: -6px;
  z-index: 100;
  left: calc(50% - 5px);
  border-left: 1px solid var(--m3-a20);
  border-bottom: 1px solid var(--m3-a20);
}

.event-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
}

.desktop-layout {
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    width: 100%;
    max-width: 1000px;
    align-items: center;
    margin-left: 290px;
    
    .event-detail, .event-options {
      
      margin: 0 auto;
    }
  }
}

.desktop-left-column {
  @media (min-width: 1024px) {
    position: sticky;
    top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    
    .event-detail, .event-options {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }
  }
}

.desktop-right-column {
  @media (min-width: 1024px) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.desktop-charts-section {
  @media (min-width: 1024px) {
    margin-top: 2rem;
    
    :deep(.chart) {
      aspect-ratio: 21/9;
      max-height: 500px;
    }
  }
}

.event-betting {
  @media (min-width: 1024px) {
    border-radius: 12px;
    
    .betting-form {
      padding: 1.5rem;
    }
    
    .quick-bet-wrapper {
      margin: 0;
    }
  }
}

.navigations {
  @media (min-width: 1024px) {
    padding: 0;
    margin: 0 0 2rem;
    
    .navigation-item {
      padding: 1rem;
      font-size: 0.875rem;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
    }
  }
}

.event-options {
  @media (min-width: 1024px) {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 800px; // Add max-width to contain the content
    margin: 0 auto; // Center the section horizontally
    
    .event-options-title {
      font-size: 1.5rem;
      margin: 1.5rem 0;
      text-align: center; // Ensure title is centered
    }

    :deep(.event-outcome-select) {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }
  }
}

.result {
  @media (min-width: 1024px) {
    .result-field {
      .result-field-value {
        font-size: 2.25rem;
      }
      .result-field-change {
        font-size: 1.125rem;
      }
    }
  }
}

:deep(.charts-accordion), :deep(.quotes-accordion) {
  @media (min-width: 1024px) {
    border: 1px solid var(--m3-a20);
    border-radius: 12px;
    overflow: hidden;
    
    .p-accordion-content {
      padding: 1.5rem;
    }
  }
}
</style>
