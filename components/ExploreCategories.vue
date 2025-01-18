<script setup>
import Loading from './Loading.vue';
import ExploreCategoryItem from './ExploreCategoryItem.vue';

const isLoading = ref(false);
const categories = ref([]);

const { getCategories } = useApi();
const prepareCategories = async () => {
    isLoading.value = true;
    const { data } = await getCategories();
    categories.value = data.value;
    isLoading.value = false;
};

const sortedCategories = computed(() => {
    return categories.value.sort((a, b) => b.num_events - a.num_events);
});

prepareCategories();

</script>

<template>
  <div>
    <Loading v-if="isLoading" />
    <div class="categories-wrapper">
      <NuxtLink
        v-for="category in sortedCategories"
        :key="category.id"
        :to="localePath(`/explore/categories/${category.slug}`)"
      >
        <ExploreCategoryItem
          v-ripple
          class="p-ripple"
          :style="{ opacity: category.num_events === 0 ? 0.2 : 1 }"
          :category="category"
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