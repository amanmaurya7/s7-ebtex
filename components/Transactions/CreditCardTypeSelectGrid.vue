<script setup>
const emit = defineEmits(['input']);
const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
});

const cardTypes = [
    {
        id: 'mastercard', 
        name: 'Mastercard',
        image: '/images/v1.5/art-master.png',
        height: '30px',
    },
    {
        id: 'visa',
        name: 'Visa',
        image: '/images/v1.5/art-visa.png',
        height: '30px',
    },
    {
        id: 'amex',
        name: 'American Express', 
        image: '/images/v1.5/art-amex.png',
        background: '#1c71b9',
        height: '32px',
    },
    {
        id: 'jcb',
        name: 'JCB',
        image: '/images/v1.5/art-jcb.png',
        height: '45px',
    },
];

const selectCard = (cardType) => {
    emit('input', cardType);
};
</script>

<template>
  <div class="credit-card-container">
    <div
      v-for="card in cardTypes"
      :key="card.id"
      class="text-center flex align-items-center justify-content-center border-radius-6px card-type-item"
      :class="{'active': props.modelValue === card.id}"
      :style="{'background': card.background || 'white'}"
      @click="selectCard(card.id)"
    >
      <div class="flex align-items-center justify-content-center">
        <img :src="card.image" :height="card.height" :alt="card.name">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.credit-card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.card-type-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--w2-500);
  aspect-ratio: 350/150;

  &.active {
    border: 2px solid var(--k1-500);
  }

  &:hover {
    background-color: var(--w2-400);
  }

  opacity: 0.2;

  &.active {
    opacity: 1;
    background-color: var(--k1-500);
  }
}
</style>
