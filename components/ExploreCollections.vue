<script setup>
import Loading from './Loading.vue';
import ExploreCollectionItem from './ExploreCollectionItem.vue';

const isLoading = ref(false);
const collections = ref([]);

const { getCollections } = useApi();
const prepareCollections = async () => {
    isLoading.value = true;
    const { data } = await getCollections();
    collections.value = data.value;
    isLoading.value = false;
};

prepareCollections();

</script>

<template>
  <div class="explore-collections-container">
    <Loading v-if="isLoading" />
    <div class="collections-wrapper">
      <NuxtLink
        v-for="collection in collections"
        :key="collection.id"
        :to="localePath(`/explore/collections/${collection.slug}`)"
      >
        <ExploreCollectionItem
          v-ripple
          class="p-ripple"
          :collection="collection"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.explore-collections-container {
  max-width: 1080px;  // reduced from 1280px
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
}

.collections-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    
    a {
      opacity: 1;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>