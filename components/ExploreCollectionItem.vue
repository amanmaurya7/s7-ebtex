<script setup>

const props = defineProps({
    collection: {
        type: Object,
        required: true,
    },
});
</script>

<template>
  <div class="collection-item p-ripple">
    <img class="collection-image" :src="props.collection.image_url">
    <div class="collection-count">
      <img src="/images/v1.5/icon-collection.png" width="12" height="12">
    </div>
    <div class="collection-name">
      <div>{{ props.collection.name }}</div>
      <div class="collection-event-count">
        <Badge class="p-badge-m4 text-white">
          {{ props.collection.num_events }}
        </Badge>
        <span class="uppercase ml-1 font-75">{{ $t('general.events') }}</span>
      </div>
    </div>
    <div class="right-part">
      <img src="/images/v1.5/icon-chevron.png" height="12">
    </div>
  </div>
</template>


<style lang="scss" scoped>
.collection-item {
  display: flex;
  width: 100%;
}

.collection-image {
  width: 100px;
  min-height: 100px;
  border-radius: 10px 0px 0px 10px;
  object-fit: cover;
}

.collection-count {
  background: var(--m4-500);
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: bold;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: white;
}

.collection-name {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem 1rem;
    background: var(--w2-500);
    font-size: 0.9375rem;;
    font-weight: bold;
    text-transform: uppercase;
    gap: 8px;
}

.right-part {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--w2-500);
  border-radius: 0 10px 10px 0;
  padding-right: 0.75rem;

}
</style>