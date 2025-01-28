<script setup>
import TransparentButton from '@/components/Common/TransparentButton.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import WagerPositionList from '@/components/Portfolio/WagerPositionList.vue';
import SortDropdown from '@/components/Portfolio/SortDropdown.vue';
import TransactionHistoryTable from '@/components/Portfolio/TransactionHistoryTable.vue';
import useTransactionHistory from '~/composables/pages/useTransactionHistory';
import Tooltip from '@/components/Common/Tooltip.vue';

definePageMeta({
    middleware: ['user-auth'],
});

const { onDepositClick, onWithdrawClick } = await useDepositWithdrawButton();
const transactionAccordionOpened = ref(false);
const {
    dataFetchingStatus,
    rowData: transactions,
} = useTransactionHistory();

const ICONS = {
    TROPHY: '/images/v1.5/icon-trophy.png',
    RANK: '/images/v1.5/icon-rank.png',
    WIN_RATE: '/images/v1.5/icon-win-rate.png',
    RETURN: '/images/v1.5/icon-return.png',
};

const { userCardData, walletData } = useDashboard();
const {
    filterOptions,
    selectedFilter,
    selectedSort,
    wagerPositionList,
    getWagerPosition,
    getNextPageWagerPosition,
    activeWagerPositionCount,
    inactiveWagerPositionCount,
} = useWagerPosition();

getWagerPosition();

const onLastShown = () => {
    getNextPageWagerPosition();
};

const onTabChange = (event) => {
    selectedFilter.value = filterOptions[event.index];
    activeTabIndex.value = event.index;
    getWagerPosition();
};

const onUpdateSort = (newVal) => {
    selectedSort.value = newVal;
    getWagerPosition();
};

const activeTabIndex = ref(0);
</script>

<template>
  <div>
    <section class="user-info text-white font-bold text-center">
      <div class="font-1375" v-html="$t('portfolio.my_account')" />
      <div class="avatar">
        <nuxt-link :to="localePath('/profile')">
          <img :src="userCardData.avatar" alt="avatar">
        </nuxt-link>
      </div>
      <div class="font-125">
        {{ userCardData.name }}
      </div>
      <div class="flex mt-3 gap-2">
        <TransparentButton @click="navigateTo(localePath('/profile'))">
          <template #content>
            <img src="/images/v1.5/icon-edit-profile.png" alt="arrow-right" width="16" class="mr-2">
            {{ $t('portfolio.edit_profile') }}
          </template>
        </TransparentButton>
        <TransparentButton @click="navigateTo(localePath('/setting'))">
          <template #content>
            <img src="/images/v1.5/icon-preferences.png" alt="arrow-right" width="16" class="mr-2">
            {{ $t('portfolio.preferences') }}
          </template>
        </TransparentButton>
      </div>

      <div class="flex justify-content-evenly mt-4 pb-4">
        <template v-for="({ key, label, value }, i) in userCardData.investStat" :key="key">
          <Tooltip class="achievement-item py-1" :tooltip-content="$t(`portfolio.${key}_tooltip`)" :hide-active-underline="true">
            <img :src="ICONS[key]" :alt="key" width="40" height="40" :style="{borderBottom: 'none !important'}">
            <p class="text-white font-75 mt-2 underline-target">
              {{ label }}
            </p>
            <div class="font-bold font-125 text-m5-500 mt-1">
              {{ value }}
            </div>
          </Tooltip>
          <div v-if="i < userCardData.investStat.length - 1" class="vertical-separator align-self-stretch" style="height: 100px;" />
        </template>
      </div>
    </section>

    <section class="wallet bg-m1-500 text-white">
      <div class="wallet-icon text-white font-bold uppercase text-center font-1375 pt-275 pb-125" v-html="$t('portfolio.my_wallet')" />
      <div class="wallet-wrapper">
        <img class="wallet-icon" src="/images/v1.5/icon-wallet-info.png" alt="wallet" width="80" height="80">
        <Tooltip
          class="font-75 font-bold text-white text-center mb-2"
          :tooltip-content="$t('portfolio.current_cash_balance_tooltip')"
        >
          <span>{{ $t('portfolio.current_cash_balance') }}</span>
        </Tooltip>
        <div class="font-250 font-bold text-k1-500 text-center glow-balance">
          {{ formatAmount(walletData.balance, 2) }}
        </div>
        <div class="flex justify-content-center align-items-center font-75 font-bold  mb-3">
          <label>
            {{ $t('portfolio.one_day_change') }}
          </label>
          <div class="value ml-2" :class="{positive: walletData.one_day_change > 0, negative: walletData.one_day_change < 0}">
            {{ formatAmount(walletData.one_day_change) }}
          </div>
        </div>
        <div class="wallet-info-item font-9375 px-75 bt-m3-a20 py-3 cummulative-winnings">
          <Tooltip
            class="text-white text-center mb-2"
            :tooltip-content="$t('portfolio.cummulative_profit_tooltip')"
          >
            <label>
              {{ $t('portfolio.cummulative_profit') }}
            </label>
          </Tooltip>
          
          <div class="value" :class="{positive: walletData.accumulated_profit_loss > 0, negative: walletData.accumulated_profit_loss < 0}">
            {{ formatAmount(walletData.accumulated_profit_loss) }}
          </div>
        </div>
        <div class="horizontal-separator" />
        <div class="wallet-info-item font-75 px-75 bt-m3-a20 pt-100">
          <Tooltip
            class="text-white text-center mb-2"
            :tooltip-content="$t('portfolio.best_case_balance_tooltip')"
          >
            <label>
              {{ $t('portfolio.best_case_balance') }}
            </label>
          </Tooltip>
          <div class="value text-m5-500">
            {{ formatAmount(walletData.best_case_fund_available) }}
          </div>
        </div>
        <div class="flex gap-2 align-items-center pb-100 px-50">
          <GradientButton tint="yellow" @click="onDepositClick">
            <template #content>
              <img src="/images/v1.5/icon-deposit.png" alt="deposit" width="16" class="mr-2">
              <span style="text-transform: none;">{{ $t('investment.deposit') }}</span>
            </template>
          </GradientButton>
          <GradientButton
            tint="yellow"
            class="withdraw-button-disabled"
            :disabled="walletData.balance <= 0"
            @click="onWithdrawClick"
          >
            <template #content>
              <img src="/images/v1.5/icon-withdraw.png" alt="deposit" width="16" class="mr-2">
              <span class="font-9375" style="text-transform: none;">{{ $t('investment.withdraw') }}</span>
            </template>
          </GradientButton>
        </div>
      </div>
      <Accordion
        class="transaction-accordion bt-m3-a20"
        expand-icon="pi pi-no"
        collapse-icon="pi pi-no"
        :disabled="transactions.length === 0"
        @tab-open="transactionAccordionOpened = true"
        @tab-close="transactionAccordionOpened = false"
      >
        <AccordionTab>
          <template #header>
            <div class="accordion-header font-75" :class="{ 'opacity-20': transactions.length === 0 }">
              <img v-if="transactionAccordionOpened" src="/images/v1.5/icon-chevron-up.png" alt="chevron-up" width="12" class="mr-2">
              <img v-else src="/images/v1.5/icon-chevron-down.png" alt="chevron-down" width="12" class="mr-2">
              {{ $t(transactionAccordionOpened ? 'portfolio.hide_transaction_history' : 'portfolio.show_transaction_history') }}
            </div>
          </template>
          <TransactionHistoryTable :transactions="transactions" />
        </AccordionTab>
      </Accordion>
    </section>
    <section>
      <div class="text-center font-bold font-1375 uppercase mt-200 mb-100" v-html="$t('portfolio.my_wagers')" />
      <TabView :active-index="activeTabIndex" @tab-change="onTabChange">
        <TabPanel>
          <template #header>
            <span class="font-75">
              {{ $t('portfolio.active') }}
            </span>
            <div v-if="activeWagerPositionCount" class="badge">
              {{ activeWagerPositionCount }}
            </div>
          </template>
          <template #default>
            <div style="background: var(--w2-500);" class="pb-250">
              <div class="flex justify-content-end">
                <SortDropdown
                  :value="selectedSort"
                  :selected-filter="selectedFilter.code"
                  class="my-2"
                  @input="onUpdateSort"
                />
              </div>
              <WagerPositionList
                :wager-position-list="wagerPositionList"
                class="px-3"
                @last-shown="onLastShown"
              />
            </div>
          </template>
        </TabPanel>
        <TabPanel>
          <template #header>
            <span class="font-75">
              {{ $t('portfolio.inactive') }}
            </span>
            <div v-if="inactiveWagerPositionCount" class="badge">
              {{ inactiveWagerPositionCount }}
            </div>
          </template>
          <template #default>
            <div style="background: var(--w2-500);" class="pb-100">
              <div class="flex justify-content-end">
                <SortDropdown
                  v-model="selectedSort"
                  :selected-filter="selectedFilter.code"
                  class="my-2"
                  @input="onUpdateSort"
                />
              </div>
              <WagerPositionList
                :wager-position-list="wagerPositionList"
                class="px-3"
                @last-shown="onLastShown"
              />
            </div>
          </template>
        </TabPanel>
      </TabView>
    </section>
  </div>
</template>

<style lang="scss" scoped>
section {
  &.user-info {
    position: relative;
    padding: 1rem;
    width: 100%;
    background-image: 
      url('/images/v1.5/bg-portfolio-header-deco.png'),
      url('/images/v1.5/bg-portfolio-header.png');
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, cover;

    @media (min-width: 1024px) {
      padding: 2rem;
      
      // Add a container for content
      > div {
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  }

  &.wallet {
    width: 100%;
    
    @media (min-width: 1024px) {
      padding: 0 2rem;
      
      > div:not(.wallet-wrapper) {
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  }
}

// Update wallet wrapper to be full width with contained content
.wallet-wrapper {
  border: 1px solid var(--m3-a20);
  margin: 3rem .5rem 3rem;
  position: relative;
  padding-top: 50px;
  border-radius: 10px;

  .wallet-icon {
    position: absolute;
    margin: 0 auto;
    display: block;
    top:-50px;
    left: calc(50% - 40px);
  }

  .wallet-info-item {
    font-weight: bold;
    color: white;
    display: flex;
    justify-content: space-between;

    .value {
      font-weight: bold;
    }
  }

  @media (min-width: 1024px) {
    width: 100%;
    max-width: none;
    
    > div {
      max-width: 800px;
      margin: 0 auto;
    }
  }
}

// Update TabView container to be full width
:deep(.p-tabview) {
  width: 100%;
  
  @media (min-width: 1024px) {
    .p-tabview-panels {
      padding: 0;
      
      > div {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }
    }
  }
}

// Update transaction accordion to be full width
:deep(.transaction-accordion) {
  width: 100%;
  
  @media (min-width: 1024px) {
    .p-accordion-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
}

// Update wager position list to be full width
.wager-position-list {
  width: 100%;
  
  @media (min-width: 1024px) {
    > div {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
  }
}

.avatar {
  width: 80px;
  height: fit-content;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--m4-500);
  margin: 1.375rem auto;
  box-shadow: 0 0 8px 1px var(--m4-500);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 1024px) {
    width: 100px;
    margin: 2rem auto;
    
  }
}

// Add responsive styles for achievements section
.achievements {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: 1rem;

  .achievement-item {
    flex: 1 1 65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .5rem;
    background-color: var(--blue-500);
    color: var(--gold-500);
  }

  @media (min-width: 1024px) {
    max-width: 800px;
    margin: 0 auto 1.5rem;
    
    .achievement-item {
      flex: 1 1 200px;
      padding: 1rem;
    }
  }
}

// Adjust TabView for desktop
:deep(.p-tabview) {
  @media (min-width: 1024px) {
    max-width: 1200px;
    margin: 0 auto;

    .p-tabview-panels {
      padding: 0 2rem;
    }
  }
}

// Adjust transaction history width
:deep(.transaction-accordion) {
  @media (min-width: 1024px) {
    max-width: 800px;
    margin: 0 auto;
  }
}

// Adjust wager position list width
.wager-position-list {
  @media (min-width: 1024px) {
    max-width: 1000px;
    margin: 0 auto;
  }
}

.edit-btn {
  padding: 2px;
  width: auto;
}

.scenario-list-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--gold-500);
  border-bottom: 1px solid #000;
  padding: .5rem .25rem;

  &:last-child {
    border-color: transparent;
  }
}

.wallet-info {
  background-color: var(--indigo-500);
  color: var(--gold-500);
  padding: .5rem;
  display: flex;
  gap: .5rem;
  text-align: center;
}

:deep(.p-tabview-header-action) {
  padding-bottom: .5rem !important;
}

:deep(.p-highlight .p-tabview-header-action), :deep(.p-tabview-header-action:hover) {
  .badge {
    background-color: var(--m4-500);
    opacity: 1;
  }
}

:deep(.p-tabview-header-action:focus) {
  box-shadow: none !important;
}

.badge {
  opacity: 0.2;
  background-color: var(--m4-500);
  color: white;
  font-weight: bold;
  font-size: .75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  margin-left: .25rem;
}


.positive {
  color: var(--m5-500);

  &::before {
    content: '▾';
    transform: rotate(180deg);
    color: white;
    display: inline-block;
    margin-right: 0.25rem;
  }
}

.negative {
  color: var(--error-500);
  &::before {
    content: '▾';
    color: white;
    margin-right: 0.25rem;
  }
}

.accordion-header {
  font-weight: bold;
  font-size: 0.75rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
} 

:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  justify-content: center;
  padding-top: 0;
  padding-bottom: 0;
  flex-direction: row !important;
}

:deep(.p-accordion-content) {
  padding: 0;
}

:deep(.p-accordion-tab) {
  display: flex;
  flex-direction: column-reverse;
}

:deep(.gradient-yellow-disabled) {

  background: transparent !important;
  border: 1px solid var(--m3-500) !important; 
  opacity: 0.2;
  color: white !important;

  &:hover, &:focus, &:active {
    background-color: var(--gold-500);
  }
}

.glow-balance {
  text-shadow: 0 0 10px #d99a26;
}

:deep(.achievement-item *:not(.underline-target)) {
  text-decoration: none !important;
}

:deep(.achievement-item .underline-target) {
  text-decoration: underline dotted 2px !important;
}
:deep(.achievement-item.active .underline-target) {
  border-bottom: 2px solid var(--m4-500) !important;
  text-decoration: none !important;
}
</style>
