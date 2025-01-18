<script setup>
import { computed } from 'vue';
import { useWalletStore } from '@/store/wallet';
import { formatAmount } from '@/utils/formatters';
  
const props = defineProps({
    artworkSrc: {
        type: String,
        required: true,
    },
    balanceDiff: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});
  
const walletStore = useWalletStore();
const { balance } = storeToRefs(walletStore);
  
const resultBalance = computed(() => {
    return balance.value + props.balanceDiff;
});
</script>
  
<template>
  <div class="deposit-withdraw-header">
    <div class="text-white font-bold uppercase font-1375 text-center pt-4" style="letter-spacing: 0.03rem;" v-html="title" />
    <img :src="artworkSrc" class="artwork">
    <div class="balance-status">
      <div class="mr-0 ml-auto">
        <div class="text-m5-500 font-1875 font-bold text-right">
          {{ formatAmount(balance) }}
        </div>
        <div class="text-white font-bold font-75 text-right">
          {{ $t('deposit_withdrawal_header.current_cash_balance') }}
        </div>
      </div>
      <div class="flex-grow-0 px-3 pt-2">
        <img width="6" src="/images/v1.5/icon-chevron-right-white.png">
      </div>
      <div class="ml-0 mr-auto" :class="{ 'opacity-20': balanceDiff === 0 }">
        <div class="font-1875 font-bold" :class="{ 'text-white': balanceDiff === 0, 'text-k1-500': balanceDiff != 0 }">
          {{ formatAmount(resultBalance) }}
        </div>
        <div class="text-white font-bold font-75">
          {{ $t('deposit_withdrawal_header.new_cash_balance') }}
        </div>
      </div>
    </div>
  </div>
</template>
  
  <style scoped>
  .deposit-withdraw-header {
    background: var(--m1-500);
    margin: 0 -1.25rem;
    padding-bottom: 1.75rem;
  }

  .artwork {
    width: 160px;
    height: 160px;
    display: block;
    margin: 1rem auto;
  }
  
  .balance-status {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
  }
  </style>