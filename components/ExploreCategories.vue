<script setup>
import Loading from './Loading.vue';
import ExploreCategoryItem from './ExploreCategoryItem.vue';

const isLoading = ref(false);
const categories = ref([]);

const { getCategories } = useApi();
const prepareCategories = async () => {
    isLoading.value = true;
    console.log('Fetching categories...');
    const { data } = await getCategories();
    console.log('Categories received:', data.value);
    categories.value = data.value;
    isLoading.value = false;
};

const sortedCategories = computed(() => {
    return categories.value.sort((a, b) => b.num_events - a.num_events);
});

prepareCategories();

</script>

<template>
  <div class="explore-categories-container">
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
.explore-categories-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
}

.categories-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 3rem;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  a {
    text-decoration: none;
    display: block;
    
    @media (min-width: 1024px) {
      opacity: 1;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>