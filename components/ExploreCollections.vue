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
  <div>
    <Loading v-if="isLoading" />
    <div class="categories-wrapper">
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
.categories-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
</style>