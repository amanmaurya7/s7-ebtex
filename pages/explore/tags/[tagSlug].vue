<script setup>
const { getTag } = useApi();
const { params: { tagSlug } } = useRoute();

const { data: tag } = await getTag(tagSlug);

const initialSortCode = tag.value.slug === 'new' ? 'elapsed time since creation' : 'relevance';
</script>

<template>
  <div v-if="tag" class="result-container">
    <SearchResultHeader class="result-header" :system-tag="tag" />
    <SearchResultList class="result-list" :system-tag="tag" :initial-sort-code="initialSortCode" />
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