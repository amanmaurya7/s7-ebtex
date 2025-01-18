<script setup>
defineProps({
    message: { type: String, required: true },
});
</script>

<template>
  <div class="error-message">
    {{ message }}
  </div>
</template>

<style scoped>
    .error-message {
    background: var(--error-500);
    color: white;
    font-weight: bold;
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    overflow: hidden;
    font-size: 0.8rem !important;
    }
</style>