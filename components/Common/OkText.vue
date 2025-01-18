<script setup>
defineProps({
    message: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <div class="ok-text font-bold uppercase font-75 text-center flex align-items-center justify-content-center gap-2 text-m4-500">
    <span class="inline-flex align-items-center"><img class="icon-ok-text" src="/images/v1.5/icon-check-green.png" width="16"></span>
    {{ message }}
  </div>
</template>

<style scoped>
.icon-ok-text {
    position: relative;
    top: -1px;
}
</style>
