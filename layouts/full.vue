<script setup>
import TopNav from '@/components/TopNav.vue';
import CustomToast from '@/components/CustomToast.vue';
import { useLayoutStore } from '@/store/layout';

const { getLayoutParameters } = useLayoutStore();
getLayoutParameters({ shouldConnectToAbly: true });
const { wrapperStyle } = useLayout();
</script>

<template>
  <div class="flex flex-column" :style="wrapperStyle">
    <TopNav />

    <div class="overflow-hidden flex-1 flex flex-column" :style="{height: 'calc(100vh - 100px)'}">
      <slot />
    </div>

    <CustomToast />
  </div>
</template>

<style lang="scss" scoped>
</style>
