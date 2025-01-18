<script setup>
const emit = defineEmits(['input']);
const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
});

const currencyTypes = [
    {
        id: 'usdt', 
        name: 'USDT',
        image: '/images/v1.5/icon-tether.png',
        background: '#53ae94',
    },
    {
        id: 'btc',
        name: 'Bitcoin',
        image: '/images/v1.5/icon-bitcoin.png',
        background: '#f7931a',
    },
    {
        id: 'eth',
        name: 'Ethereum',
        image: '/images/v1.5/icon-eth.png',
        background: '#627eea',
    },
    {
        id: 'slash',
        name: 'Slash Payment',
        image: '/images/v1.5/icon-slash.png',
        background: 'linear-gradient(-45deg, #bc03d3 0%, #079ed0 100%)',
        height: '25px',
    },
];

const selectCard = (cardType) => {
    emit('input', cardType);
};
</script>

<template>
  <div class="credit-card-container">
    <div
      v-for="currency in currencyTypes"
      :key="currency.id"
      class="text-center flex align-items-center justify-content-start card-type-item"
      :class="{'active': props.modelValue === currency.id}"
      @click="selectCard(currency.id)"
    >
      <div class="icon-container" :style="{'background': currency.background || 'white'}">
        <img :src="currency.image" :height="currency.height || '50px'" :alt="currency.name">
      </div>
      <div class="text-left ml-3">
        <div class="uppercase font-bold font-9375">
          {{ currency.id === 'slash' ? currency.name : currency.id }}
        </div>
        <div v-if="currency.id !== 'slash'" class="font-bold font-75">
          {{ currency.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-type-item {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 10px;
  margin-top: 10px;
  &:first-child {
    margin-top: 20px;
  }
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--w2-500);

  .icon-container {
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.active {
    border: 2px solid var(--k1-500);
  }

  opacity: 0.2;

  &.active {
    opacity: 1;
    border-color: var(--k1-500);
  }
}
</style>
