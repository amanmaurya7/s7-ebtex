<script setup>
defineProps({
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
});
</script>

<template>
  <div class="text-center font-bold uppercase font-75">
    <span class="text-k1-500">{{ formatAmount(from, 2) }}</span> {{ $t('betting.available') }}
    <span class="small-triangle">▶</span>
    <span :class="{ 'text-k1-500': to >= 0, 'text-error-500': to < 0 }">{{ formatAmount(to, 2) }}</span> {{ $t('betting.remainning') }}
  </div>
</template>

<style scoped>
.small-triangle {
    transform: scale(1.5);
    font-size: 0.3rem !important;
    display: inline-flex;
    align-items: center;
    position: relative;
    top: -2px;
    margin: 0 6px;
}
</style>
