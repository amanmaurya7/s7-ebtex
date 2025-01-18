<script setup>
import { useLayoutStore } from '@/store/layout';

const { getLayoutParameters } = useLayoutStore();
getLayoutParameters({ shouldConnectToAbly: true });
const { wrapperStyle } = useLayout();
</script>

<template>
  <div class="flex flex-column" :style="wrapperStyle">
    <TopNav />

    <div class="overflow-hidden flex-1 flex flex-column">
      <slot />
    </div>

    <Navbar />
    <CustomToast />
  </div>
</template>

<style lang="scss" scoped>
</style>
