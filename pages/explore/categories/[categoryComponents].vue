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

</script>

<template>
  <div v-if="category" class="result-container">
    <SearchResultHeader
      class="result-header"
      :category="category"
      :subcategory="subcategory"
    />
    <SearchResultList
      class="result-list"
      :category="category"
      :subcategory="subcategory"
    />
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