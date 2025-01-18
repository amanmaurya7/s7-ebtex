<script setup>
import GradientButton from '@/components/Common/GradientButton.vue';
import { computed } from 'vue';
import { useWalletStore } from '@/store/wallet';
import { formatAmount } from '@/utils/formatters';
import OrLine from '@/components/Common/OrLine.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
  
const walletStore = useWalletStore();
const { balance } = storeToRefs(walletStore);
walletStore.getWallet();

const props = defineProps({
    isSuccess: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});


const artworkSrc = computed(() => {
    return props.isSuccess ? '/images/v1.5/art-transaction-success.png' : '/images/v1.5/art-transaction-failed.png';
});

const title = computed(() => {
    return props.isSuccess ? t('deposit_withdrawal_result.deposit_success_title') : t('deposit_withdrawal_result.deposit_failed_title');
});

const amountColorClass = computed(() => {
    return props.isSuccess ? 'text-k1-500' : 'text-m5-500';
});

const onTryAgain = () => {
    if (props.type === 'deposit') {
        navigateTo('/deposit');
    } else {
        navigateTo('/withdraw');
    }
};
</script>
  
<template>
  <div class="deposit-withdraw-result-container">
    <div class="text-white font-bold uppercase font-1375 text-center pt-4" style="letter-spacing: 0.03rem;" v-html="title" />
    <img :src="artworkSrc" class="artwork">
    <div class="balance-status pb-4">
      <div class="mr-0 ml-auto">
        <div class="font-1875 font-bold" :class="[amountColorClass]">
          {{ formatAmount(balance) }}
        </div>
        <div class="text-white font-bold font-75">
          {{ $t('deposit_withdrawal_header.current_cash_balance') }}
        </div>
      </div>
    </div>

    <div class="bg-white py-4 px-4 mx-2 text-center">
      <div v-html="$t(`deposit_withdrawal_result.${props.type}_${props.isSuccess ? 'success' : 'failed'}_text`)" />

      <div class="bottom-button-container">
        <GradientButton v-if="!props.isSuccess" tint="yellow" class="mt-1" @click="onTryAgain">
          <template #content>
            <div class="flex align-items-center gap-2">
              <img src="/images/v1.5/icon-reload.png" width="12">
              {{ $t('deposit_withdrawal_result.try_again') }}
            </div>
          </template>
        </GradientButton>
        <OrLine v-if="!props.isSuccess" class="w-100" />

        <GradientButton @click="navigateTo('/portfolio')">
          <template #content>
            <div class="flex align-items-center gap-2">
              <img src="/images/v1.5/icon-portfolio.png" height="16">
              {{ $t('deposit_withdrawal_result.back_to_portfolio') }}
            </div>
          </template>
        </GradientButton>
      </div>
    </div>
  </div>
</template>
  
  <style scoped>
  .deposit-withdraw-result-container {
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
    text-align: center;
  }

  .bottom-button-container {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
  }
  </style>