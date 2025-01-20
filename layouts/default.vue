<script setup>
import { useLayoutStore } from '@/store/layout';

const { getLayoutParameters, connectToAbly } = useLayoutStore();
await getLayoutParameters();
await connectToAbly();
const { wrapperStyle } = useLayout();

onMounted(() => {
    window.embeddedChatbotConfig = {
        chatbotId: "Ix9bqFBNFqDGbJ2e-Uf0K",
        domain: "www.chatbase.co"
    };
});
</script>

<template>
  <div :style="wrapperStyle" class="min-h-screen">
    <TopNav />
    <div class="overflow-hidden">
      <div>
        <slot />
      </div>
      <PageFooter />
    </div>

    <Navbar />
    <CustomToast />
  </div>
</template>

<style lang="scss" scoped>
</style>
