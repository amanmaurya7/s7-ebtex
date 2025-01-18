<script setup>
const { wrapperStyle } = useLayout();
</script>
<template>
  <div class="h-full" :style="wrapperStyle">
    <slot />
    <CustomToast />
  </div>
</template>
