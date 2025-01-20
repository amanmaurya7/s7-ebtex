<script setup>
const { getTag } = useApi();
const { params: { categoryComponents } } = useRoute();

let categorySlug = null;
let subcategorySlug = null;
if (categoryComponents.indexOf('--') >= 0) {
    const components = categoryComponents.split('--');
    categorySlug = components[0];
    subcategorySlug = components[1];
} else {
    categorySlug = categoryComponents;
}

const category = await (getTag(categorySlug).data);
let subcategory = null;
if (subcategorySlug) {
    subcategory = await (getTag(subcategorySlug.toUpperCase()).data);
}

import { computed } from 'vue';
const hasEvents = computed(() => category.value?.num_events > 0);

</script>

<template>
  <div v-if="category" class="result-container">
    <div class="content-wrapper">
      <SearchResultHeader
        class="result-header"
        :category="category"
        :subcategory="subcategory"
      />
      <div class="result-list">
        <NoEvents v-if="!hasEvents" />
        <SearchResultList
          v-else
          :category="category"
          :subcategory="subcategory"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.result-container {
    background: var(--m1-500);
    min-height: 60vh;
    display: flex;
    justify-content: center;
}

.content-wrapper {
    width: 100%;
    max-width: 1200px;
    position: relative;
}

.result-header {
    position: fixed;
    top: 60px;
    width: 100%;
    background-color: white;
    z-index: 10;

    @media (min-width: 1024px) {
        width: 1200px;
        padding: 0 2rem;
    }
}

.result-list {
    padding-top: 60px;
    
    @media (min-width: 1024px) {
        padding: 80px 2rem 2rem;
    }
}
</style>