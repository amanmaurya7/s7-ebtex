<script setup>
import ExploreTagItem from './ExploreTagItem.vue';

const isLoading = ref(false);
const tags = ref([]);

const { getTags } = useApi();
const prepareTags = async () => {
    isLoading.value = true;
    const { data } = await getTags();
    tags.value = data.value.sort((a, b) => b.num_events - a.num_events);
    isLoading.value = false;
};

prepareTags();
</script>

<template>
  <div class="explore-tags-container">
    <div class="tags-wrapper">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.key"
        :to="localePath(`/explore/tags/${tag.slug}`)"
      >
        <ExploreTagItem
          v-ripple
          class="p-ripple"
          :tag="tag"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.explore-tags-container {
  max-width: 1080px;  // reduced from 1280px
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
}

.tags-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}
</style>