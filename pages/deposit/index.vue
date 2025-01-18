<script setup>
import TransparentButton from '~/components/Common/TransparentButton.vue';
import GradientButton from '~/components/Common/GradientButton.vue';
import XInputText from '~/components/Common/XInputText.vue';
import OnrampCryptoFrame from '~/components/OnrampCryptoFrame.vue';
import DepositWithdrawHeader from '../../components/Transactions/DepositWithdrawHeader.vue';
import Bubble from '~/components/Common/Bubble.vue';
import CreditCardTypeSelectGrid from '../../components/Transactions/CreditCardTypeSelectGrid.vue';
import CryptoTypeSelect from '../../components/Transactions/CryptoTypeSelect.vue';
definePageMeta({
    middleware: ['user-auth'],
});

const api = useApi();
const amount = ref(0);
const paymentMethod = ref(null);
const cardType = ref(null);
const cryptoType = ref(null);
const showCryptoIframe = ref(false);
const runtimeConfig = useRuntimeConfig();
const ccDisabled = ref(runtimeConfig.public.disabledCC);

const isProceedDisabled = computed(() => {
    return amount.value <= 0
        || paymentMethod.value === null
        || (paymentMethod.value === 'credit_card' && cardType.value === null);
});

const goToPayment = () => {
    console.log('goToPayment', paymentMethod.value, cardType.value, cryptoType.value);
    if (paymentMethod.value === 'credit_card') {
        openOnRampCreditCard();
    } else if (paymentMethod.value === 'crypto') {
        if (cryptoType.value === 'slash') {
            openSlashPayment();
        } else {
            openOnRampCrypto();
        }
    }
};

const openOnRampCrypto = () => {
    showCryptoIframe.value = true;
};

const openSlashPayment = async () => {
    try {
        const result = await api.getSlashPaymentUrl({
            amount: amount.value,
            currency: 'USD',
        });
        window.location = result.payment_url;
    } catch (error) {
        console.error('Error getting payment URL:', error);
    }
};

const openOnRampCreditCard = async () => {
    try {
        const result = await api.getOnRampCreditCardUrl({
            amount: amount.value,
            currency: 'USD',
            cardType: cardType.value,
        });
        window.location = result.payment_url;
    } catch (error) {
        console.error('Error getting credit card URL:', error);
    }
};

const onPaymentConfirmed = () => {
    navigateTo('/deposit/success');
};

const onAmountChange = (newValue) => {
    amount.value = newValue;
};

const onCreditCardClick = () => {
    if (ccDisabled.value) {
        return;
    }
    paymentMethod.value = 'credit_card';
};

</script>

<template>
  <section class="deposit-container bg-white">
    <DepositWithdrawHeader
      :balance-diff="amount"
      :title="$t('deposit_withdrawal_header.deposit_cash')"
      artwork-src="/images/v1.5/art-deposit.png"
    />
    
    <div>
      <div class="w-full">
        <XInputText
          id="amount"
          v-model="amount"
          type="number"
          :field-name="$t('deposit_withdrawal_header.amount')"
          :min="0"
          :max="10000"
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

      <div v-if="amount > 0" class="mt-4">
        <div class="font-bold font-9375">
          {{ $t('deposit.select_payment_method') }}
        </div>
        <div style="margin: 1rem -1.25rem 0;width: 100vw;">
          <Bubble class="w-full py-3" :has-tick="paymentMethod !== null" :center-tick="paymentMethod !== null">
            <div class="flex justify-content-around align-items-center gap-2">
              <div class="relative text-center payment-method flex-grow-1 align-self-stretch flex align-items-center justify-content-center border-radius-6px" :class="{'active': paymentMethod === 'credit_card'}" @click="onCreditCardClick">
                <div class="py-2" :style="{'opacity': ccDisabled ? 0.2 : 1}">
                  <img src="/images/v1.5/icon-card.png" alt="card" width="20" class="mr-2 mb-2">
                  <div class="font-bold font-75 whitespace-pre-wrap" v-html="$t('deposit.credit_card')" />
                </div>
                <div v-if="ccDisabled" class="font-75 text-center coming-soon">
                  {{ $t('deposit.credit_card_coming_soon') }}
                </div>
              </div>
              <div v-if="!paymentMethod" class="vertical-divider" style="height: 4rem;" />
              <div class="text-center payment-method flex-grow-1 align-self-stretch flex align-items-center justify-content-center border-radius-6px" :class="{'active': paymentMethod === 'crypto'}" @click="paymentMethod = 'crypto'">
                <div class="py-2">
                  <img src="/images/v1.5/icon-crypto.png" alt="crypto" width="20" class="mr-2 mb-2">
                  <div class="font-bold font-75 whitespace-pre-wrap" v-html="$t('deposit.crypto')" />
                </div>
              </div>
            </div>
          </Bubble>
        </div>
        <div v-if="paymentMethod === 'credit_card'">
          <div class="font-bold font-9375">
            {{ $t('deposit.card_type') }}
          </div>
          <CreditCardTypeSelectGrid v-model="cardType" @input="cardType = $event" />
        </div>

        <div v-if="paymentMethod === 'crypto'">
          <div class="font-bold font-9375">
            {{ $t('deposit.currency_type') }}
          </div>
          <CryptoTypeSelect v-model="cryptoType" @input="cryptoType = $event" />
        </div>
      </div>
    </div>

    <div v-if="amount > 0 && (paymentMethod === 'credit_card' || paymentMethod === 'crypto')">
      <GradientButton
        :disabled="isProceedDisabled"
        tint="yellow"
        @click="goToPayment"
      >
        <template #content>
          <img :src="`/images/v1.5/icon-deposit${isProceedDisabled ? '-green' : ''}.png`" alt="arrow-right" width="16" class="mr-2">
          {{ $t('deposit.make_deposit') }}
        </template>
      </GradientButton>
      <div class="mt-4 font-9375 text-center">
        <img src="/images/v1.5/icon-external.png" alt="warning" width="16" class="mr-2">
        {{ $t('deposit.you_will_be_taken_to_an_external_website') }}
      </div>
    </div>

    <div class="bottom-button-container mt-4 bt-m3-a20 py-4">
      <TransparentButton @click="navigateTo('/portfolio')">
        <template #content>
          <img src="/images/v1.5/icon-chevron-right.png" alt="cancel" width="12" class="mr-2 tint-m3-500-filter rotate-180">
          <span class="text-m3-500">{{ $t('button.back_to_portfolio') }}</span>
        </template>
      </TransparentButton>
    </div>

    <!-- Crypto Iframe -->
    <OnrampCryptoFrame
      v-if="showCryptoIframe"
      :fiat-amount="amount"
      :crypto-type="cryptoType"
      :on-back="() => { showCryptoIframe = false; }"
      @payment-confirmed="onPaymentConfirmed"
    />
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

.coming-soon {
  position: absolute;
  top: 0px;
  font-size: 1rem;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--m3-500);
  justify-content: center;
}
</style>
