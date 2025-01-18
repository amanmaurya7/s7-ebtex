<script setup>
const props = defineProps({
    maxMarkValue: {
        type: Number,
        required: true,
    },
});

const shouldShowMaxMarkValue = computed(() => {
    const attrs = useAttrs();
    return props.maxMarkValue != attrs.max;
});

const maxMarkValueStyle = computed(() => {
    if (!sliderContainer.value) {
        return;
    }
    const fullWidth = sliderContainer.value.getBoundingClientRect().width;
    const attrs = useAttrs();
    return {
        left: (fullWidth * (props.maxMarkValue - 1) / (attrs.max - 1)) + 'px',
    };
});

const attrs = useAttrs();
const disabledProgressBarStyle = computed(() => {
    if (!sliderContainer.value) {
        return;
    }
    const fullWidth = sliderContainer.value.getBoundingClientRect().width;
    return {
        left: (fullWidth * (props.maxMarkValue - 1) / (attrs.max - 1)) + 'px',
    };
});

const sliderContainer = ref(null);
</script>
<template>
  <div ref="sliderContainer" class="relative">
    <Slider v-bind="$attrs" />
    <div v-if="shouldShowMaxMarkValue" class="disabled-progress-bar" :style="disabledProgressBarStyle" />
    <div v-if="shouldShowMaxMarkValue" class="max-mark-value" :style="maxMarkValueStyle" />
  </div>
</template>

<style scoped>
.max-mark-value {
  position: absolute;
  bottom: -5px;
  height: 18px;
  width: 2px;
  background-color: red;
}

.disabled-progress-bar {
    background: white;
    height: 6px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;

    position: absolute;
    bottom: 1px;
    right: 1px;
}

:deep(.p-slider-handle) {
    z-index: 100;
}
</style>


