<script setup>
const emit = defineEmits(['click']);
defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

const handleClick = (event) => {
    emit('click', event);
};

</script>

<template>
  <Button 
    class="hollow-button" 
    :class="{disabled: disabled}"
    @click="handleClick"
  >
    <template #icon>
      <img src="/images/v1.5/icon-chevron-right.png" class="tint-m3-500-filter opacity-20 opacity-100" alt="arrow-left" width="11">
      <slot name="content" />
    </template>
  </Button>
</template>

<style lang="scss" scoped>

img {
  transform: rotate(180deg);
}

.hollow-button:hover {
  img {
    filter: none !important;
  }
}

.hollow-button {
    width: 100%;
    margin: 1.5rem auto 0rem;
    font-weight: bold;
    font-size: 1rem;;
    padding: 0.9375rem 0;
    background: white;
    border: 1px solid var(--m3-a20);
    color: var(--m3-500);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

:deep(.p-button-label) {
  flex-grow: 0;
}

</style>