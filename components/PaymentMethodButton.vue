<script setup>
const props = defineProps({
    paymentMethod: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});
const icon = computed(() => {
    return props.disabled
        ? props.paymentMethod.disabled_icon
        : props.selected
            ? props.paymentMethod.active_icon
            : props.paymentMethod.icon;
});
</script>

<template>
  <Button
    v-if="paymentMethod"
    class="payment-button"
    :class="[{ 'selected': selected, 'disabled': disabled }]"
  >
    <img :src="icon" :alt="paymentMethod.code" width="20" height="20">
    <div>{{ $t(`payment.${paymentMethod.code}`) }}</div>
  </Button>
</template>

<style lang="scss" scoped>
.payment-button {
  font-size: 0.875rem;
  display: flex;
  gap: 4px;
  padding: .25rem;
  border: .5px solid var(--gray-600);
  background-color: #fff;
  border-radius: 0;
  color: #000;

  &.selected {
    outline: 1px solid #000;
    background-color: var(--primary-500);
    color: #fff;
  }

  &.disabled {
    pointer-events: none;
    background-color: var(--gray-200);
    color: var(--gray-600);
  }
}
</style>
