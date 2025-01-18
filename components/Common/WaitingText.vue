<script setup>
defineProps({
    message: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <div class="ok-text font-bold uppercase font-75 text-center flex align-items-center justify-content-center gap-2 text-m3-500">
    <span class="inline-flex align-items-center"><img class="icon-ok-text tint-m3-500-filter" src="/images/v1.5/icon-clock.png" width="12"></span>
    {{ message }}
  </div>
</template>

<style scoped>
.icon-ok-text {
    position: relative;
    top: -1px;
}
</style>
