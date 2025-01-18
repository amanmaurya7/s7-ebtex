<script setup>
import GradientButton from './GradientButton.vue';
defineProps({
    label: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
  <GradientButton :disabled="disabled">
    <template #content>
      <span class="inline-block mr-2">
        {{ label }}
      </span>
      <img src="/images/v1.5/icon-chevron-right.png" alt="arrow-right" width="11" :class="{'tint-m3-500-filter opacity-20': disabled, 'opacity-100': disabled}">
    </template>
  </GradientButton>
</template>