<script setup>
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/store/wallet';
import TransparentButton from '~/components/Common/TransparentButton.vue';
import GradientButton from '~/components/Common/GradientButton.vue';
import XInputText from '~/components/Common/XInputText.vue';
import DepositWithdrawHeader from '../../components/Transactions/DepositWithdrawHeader.vue';
definePageMeta({
    middleware: ['user-auth'],
});

const { $showToast } = useNuxtApp();
const { t } = useI18n();
const isLoading = ref(false);
const walletStore = useWalletStore();
const { balance } = storeToRefs(walletStore);
const amount = ref(0);

const isProceedDisabled = computed(() => {
    return amount.value <= 0;
});

const withdrawError = ref(null);
const openOnRampWithdraw = async () => {
    const { getOnRampWithdrawUrl } = useApi();

    isLoading.value = true;
    const result = await getOnRampWithdrawUrl({ amount: amount.value, currency: 'USD' }, {
        onResponseError: (result) => {
            if (result.response?._data?.code === 40301) {
                withdrawError.value = t('withdrawal.error.40301', { address: 'support@everyx.io' });
            } else {
                $showToast('error', t('errors.fail_to_get_result'));
            }
        },
    });
    if (result.withdraw_url) {
        window.open(result.withdraw_url, '_self');
    }
    isLoading.value = false;
};

const onAmountChange = (value) => {
    amount.value = value;
};

</script>

<template>
  <section class="deposit-container bg-white">
    <DepositWithdrawHeader
      :balance-diff="-amount"
      :title="$t('deposit_withdrawal_header.withdraw_cash')"
      artwork-src="/images/v1.5/art-withdraw.png"
    />
    
    <div v-if="!withdrawError">
      <div class="w-full">
        <XInputText
          id="amount"
          v-model="amount"
          type="number"
          :field-name="$t('deposit_withdrawal_header.amount')"
          :min="0"
          :max="balance"
          tint="--k1-500"
          prefix="$"
          class="w-full"
          @change="onAmountChange"
        >
          <template #hint>
            <span class="font-75" v-html="$t('deposit_withdrawal_header.min_amount', { min: formatAmount(10), max: formatAmount(10000) })" />
          </template>
        </XInputText>
      </div>
    </div>

    <div v-if="amount > 0 && !withdrawError">
      <GradientButton
        :disabled="isProceedDisabled || isLoading"
        tint="yellow"
        @click="openOnRampWithdraw"
      >
        <template #content>
          <img :src="`/images/v1.5/icon-deposit${isProceedDisabled ? '-green' : ''}.png`" alt="arrow-right" width="16" class="mr-2">
          {{ $t('deposit.make_withdrawal') }}
        </template>
      </GradientButton>
      <div class="mt-4 font-9375 text-center">
        <img src="/images/v1.5/icon-external.png" alt="warning" width="16" class="mr-2">
        {{ $t('deposit.you_will_be_taken_to_an_external_website') }}
      </div>
    </div>

    <div v-if="withdrawError">
      <div class="mt-4 text-center py-4 px-4 mx-2" v-html="withdrawError" />
    </div>

    <div class="bottom-button-container mt-4 bt-m3-a20 py-4">
      <TransparentButton @click="navigateTo('/portfolio')">
        <template #content>
          <img src="/images/v1.5/icon-chevron-right.png" alt="cancel" width="12" class="mr-2 tint-m3-500-filter rotate-180">
          <span class="text-m3-500">{{ $t('button.back_to_portfolio') }}</span>
        </template>
      </TransparentButton>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  margin: 0 1.25rem;
}

:deep(.vertical-divider) {
  display: inline-block;
  width: 1px;
  height: .75rem;
  background-color: var(--m3-a20);
  margin: 0 0.25rem;
}

:deep(.p-inputnumber .p-inputtext:focus) {
  color: var(--k1-500);
}

.bottom-button-container {
  background-color: var(--w2-500);
  margin: 0 -1.25rem;
  padding: 1rem;
}

.payment-method.active {
  background-color: var(--k1-500);
  & > div {
    filter: invert(1) brightness(100);
  }
}
</style>