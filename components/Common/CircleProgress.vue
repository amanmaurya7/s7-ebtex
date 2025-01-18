<script setup>
import { computed } from 'vue';

const props = defineProps({
    progress: {
        type: Number,
        required: true,
        default: 0,
    },
    length: {
        type: Number,
        default: 100,
    },
    trackLength: {
        type: Number,
        default: 4,
    },
    tint: {
        type: String,
        default: '#ff0000',
    },
    trackColor: {
        type: String,
        default: '#FFFFFF20',
    },
    textColor: {
        type: String,
        default: '#FFFFFF',
    },
});

const circumference = 2 * Math.PI * 45;
const dashOffset = computed(() => {
    return circumference * (1 - props.progress / 100);
});
</script>

<template>
  <div class="circle-progress-container" :style="{ width: `${props.length}px`, height: `${props.length}px` }">
    <svg class="circle-progress" :width="props.length" :height="props.length" viewBox="0 0 100 100">
      <circle
        class="circle-progress-background"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        :stroke="trackColor"
        :stroke-width="props.trackLength"
      />
      <circle
        class="circle-progress-bar"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        :stroke="tint"
        :stroke-width="props.trackLength"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="circle-progress-text" :style="{ color: textColor }">
      {{ progress }}
    </div>
  </div>
</template>


<style scoped>
.circle-progress-container {
  position: relative;
  color: #FFFFFF;
  transform: rotate(-90deg);
}

.circle-progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  transform: rotate(90deg);
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
