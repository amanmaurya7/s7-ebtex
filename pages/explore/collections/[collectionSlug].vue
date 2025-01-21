<script setup>
const { getCollection } = useApi();
const { params: { collectionSlug } } = useRoute();

const { data: collection } = await getCollection(collectionSlug);

const hasEvents = computed(() => collection.value?.events?.length > 0);
</script>

<template>
  <div v-if="collection" class="result-container">
    <SearchResultHeader class="result-header" :collection="collection" />
    <NoEvents v-if="!hasEvents" />
    <SearchResultList v-else class="result-list" :collection="collection" />
  </div>
</template>

<style lang="scss" scoped>

.result-container {
    background: var(--m1-500);
    min-height: 60vh;
}

.result-header {
    position: fixed;
    top: 60px;
    width: 100vw;
    background-color: white;
    z-index: 10;
}

.result-list {
    padding-top: 60px;
}
</style>