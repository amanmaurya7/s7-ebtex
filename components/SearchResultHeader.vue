<script setup>

import { generalIcons } from 'assets/svg';

const props = defineProps({
    collection: { type: Object, required: false, default: null },
    category: { type: Object, required: false, default: null },
    subcategory: { type: Object, required: false, default: null },
    systemTag: { type: Object, required: false, default: null },
});

const onBackClick = () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        if (props.collection) {
            router.push({ path: $localePath('/explore/collections') });
        } else if (props.category) {
            router.push({ path: $localePath('/explore/categories') });
        } else if (props.systemTag) {
            router.push({ path: $localePath('/explore/tags') });
        } else {
            router.push({ path: '/' });
        }
    }

};
</script>

<template>
  <div class="header-wrapper">
    <div v-ripple class="p-ripple back-button" @click="onBackClick">
      <img :src="generalIcons.arrowLeft" alt="Back">
    </div>
    <div v-if="props.collection" class="header-title">
      <img src="/images/v1.5/icon-collection-green.png">
      {{ props.collection.name }}
    </div>
    <div v-if="props.category" class="header-title uppercase">
      <img src="/images/v1.5/icon-category-green.png">
      {{ props.category.name }}
      <img v-if="props.subcategory" src="/images/v1.5/icon-subcategory-green.png">
      <span v-if="props.subcategory">
        {{ props.subcategory.name }}
      </span> 
    </div>
    <div v-if="props.systemTag" class="header-title">
      <img src="/images/v1.5/icon-tag-green.png">
      {{ props.systemTag.name }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-wrapper {
    border-bottom: 1px solid #00b3b351;
    display: flex;
}
.back-button {
    width: 60px;
    height: 60px;
    margin-top: 8px;
    background: var(--m4-500);
    align-items: center;
    justify-content: center;
    display: flex;

    img {
        width: 30px;
        height: 30px;
        filter: invert(100%) sepia(100%) saturate(2%) hue-rotate(62deg) brightness(106%) contrast(101%);
    }
}

.header-title {
  display: flex;
  font-size: 0.9375rem;
  font-weight: bold;
  align-items: center;
  margin-top: 8px;
  padding: 0px 1.25rem;
  gap: 0.5rem;

  img {
    filter: invert(46%) sepia(89%) saturate(1432%) hue-rotate(144deg) brightness(94%) contrast(101%);
    width: 12px;
    height: 12px;
  }
}
</style>