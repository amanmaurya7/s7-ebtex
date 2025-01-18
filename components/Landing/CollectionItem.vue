<script setup>
const ColorThiefLibrary = await import('colorthief');
const ColorThief = ColorThiefLibrary.default;
const colorThief = new ColorThief();

const props = defineProps({
    collection: {
        type: Object,
        required: true,
    },
});

const dominantColor = ref('var(--m1-500)');
const collectionImage = ref(null);
const onImageLoad = () => {
    try {
        const rgb = colorThief.getColor(collectionImage.value);
        dominantColor.value = `rgb(${rgb.map(value => value).join(',')})`;
    } catch (error) {
        console.error(error);
    }
};

const containerStyle = computed(() => {
    return {
        backgroundColor: dominantColor.value,
    };
});
</script>

<template>
  <div class="collection-item p-ripple" :style="containerStyle">
    <img ref="collectionImage" class="collection-image" crossorigin="anonymous" :src="props.collection.image_url" @load="onImageLoad">
    <div class="collection-name">
      <div>{{ props.collection.name }}</div>
      <div class="collection-event-count">
        <Badge class="p-badge-m4 text-white">
          {{ props.collection.num_events }}
        </Badge>
        <span class="uppercase ml-1 font-75">{{ $t('general.events') }}</span>
        <img src="/images/v1.5/icon-collection.png" width="12" height="12">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collection-item {
  display: flex;
  height: 150px;
  overflow: hidden;
  border-radius: 10px 0px 0px 10px;
}

.collection-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.collection-name {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 1.75rem;
  line-height: 1.25rem;
  background: var(--w2-500);
  font-size: 0.9375rem;
  font-weight: bold;
  gap: 8px;

  & > div:first-child {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.collection-event-count {
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    justify-self: flex-end;
    margin-left: auto;
  }
}

</style>
