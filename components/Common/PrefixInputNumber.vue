<script setup>
import InputNumber from 'primevue/inputnumber';

defineProps({
    prefix: {
        type: String,
        default: '',
    },
});

</script>

<template>
  <div>
    <span class="prefix">{{ prefix }}</span>
    <InputNumber v-bind="$attrs" />
  </div>
</template>

<style scoped lang="scss">
:deep(.p-inputtext) {
  font-weight: bold;
  border-bottom: 2px solid var(--m4-500);
  border-radius: 0;
  padding: .25rem .5rem 0;
  width: 100%;
  font-size: 1.875rem;
  position: relative;

  position: relative;
  display: inline-block;

  padding-left: 1rem;
  display: inline-block;

  &:focus {
    border-bottom: 2px solid var(--m4-500);
  }
}

.prefix {
  position: relative;
  left: .75rem;
  z-index: 1;
  font-size: .75rem;
  font-weight: bold;
}
</style>