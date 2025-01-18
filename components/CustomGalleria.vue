<script setup>
const props = defineProps({
    value: { type: Array, required: true },
    numVisible: { type: Number, required: false, default: 1 },
    showNavigators: { type: Boolean, required: false, default: true },
    activeIndex: { type: Number, required: false, default: 0 },
});

const emits = defineEmits(['update:active-index']);

const galleryActiveIndex = ref(props.activeIndex);

const onClickPrev = () => {
    if(galleryActiveIndex.value === 0) {
        galleryActiveIndex.value = props.value.length - 1;
    } else {
        galleryActiveIndex.value -= 1;
    }
};
const onClickNext = () => {
    if(galleryActiveIndex.value === props.value.length - 1) {
        galleryActiveIndex.value = 0;
    } else {
        galleryActiveIndex.value += 1;
    }
};
const onClickIndicator = (index) => {
    galleryActiveIndex.value = index;
};

watch(galleryActiveIndex, (index) => {
    emits('update:active-index', index);
});

watch(() => props.activeIndex, (index) => {
    if (index !== galleryActiveIndex.value) {
        galleryActiveIndex.value = index;
    }
});
</script>

<template>
  <div class="galleria-container">
    <Galleria
      v-model:activeIndex="galleryActiveIndex"
      :value="value"
      :num-visible="numVisible"
      :show-thumbnails="false"
    >
      <template #item="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>
      <template #footer>
        <div v-if="showNavigators" class="flex align-items-center justify-content-between p-2 gap-2">
          <Button rounded @click="onClickPrev">
            <Icon name="ic:twotone-chevron-left" />
          </Button>
          <p class="text-white text-center flex-1">
            {{ value[galleryActiveIndex]?.label }}
          </p>
          <Button rounded @click="onClickNext">
            <Icon name="ic:twotone-chevron-right" />
          </Button>
        </div>
        <div class="flex align-items-center justify-content-center gap-2 pb-3" :class="{ 'pt-3': !showNavigators }">
          <span
            v-for="(item, index) in value"
            :key="index"
            class="galleria-indicator"
            :class="{'highlight': index === galleryActiveIndex}"
            @click="onClickIndicator(index)"
          />
        </div>
      </template>
    </Galleria>
  </div>
</template>

<style lang="scss" scoped>
:deep(.p-button) {
  border: 1px solid #fff;
  color: #fff;
  font-size: 2rem;
  padding: 0;
}

:deep(.p-galleria-item) {
  width: 100%;
  aspect-ratio: 3 / 2;
  background-color: var(--gray-800);
  align-items: start;
}

.galleria-indicator {
  width: .5rem;
  height: .5rem;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;

  &.highlight {
    background-color: #000;
  }
}
</style>
