<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { defineEmits } from 'vue';
import HistoryCardV2 from '@/components/HistoryCardV2.vue';
const emit = defineEmits(['lastShown']);

defineProps({
    wagerPositionList: {
        type: Array,
        default: () => [],
    },
});

const lastCardRef = ref(null);
const observer = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio > 0) {
        emit('lastShown');
    }
});

watch(lastCardRef, (newVal, oldVal) => {
    if(oldVal) {
        observer.unobserve(oldVal);
    }
    if(newVal) {
        observer.observe(newVal);
    }
});

onBeforeUnmount(() => {
    observer.disconnect();
});
</script>

<template>
  <div v-if="!wagerPositionList.length" class="text-xs text-center">
    {{ $t('dashboard.no_wager_history') }}
  </div>
  <div v-else>
    <HistoryCardV2
      v-for="history in wagerPositionList"
      :key="history.event_id + history.is_leveraged"
      :history="history"
      class="history-card"
    />
    <div ref="lastCardRef" />
  </div>
</template>

<style scoped>
.history-card {
  margin-bottom: 1.2rem;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>